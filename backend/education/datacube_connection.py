import io
import json
import re
import secrets
from datetime import UTC, datetime
from time import time
from uuid import uuid1, uuid4

import qrcode
import requests
from django.urls import reverse
from rest_framework.exceptions import NotFound

from app.constants import EDITOR_API
from education.constants import DB_API, DB_API_CRUD
from education.helpers import (
    CustomAPIException,
    encrypt_credentials,
    generate_unique_collection_name,
    upload_image_to_interserver,
)
from education.models import PublicId
from education.serializers import PublicIdSerializer

headers = {"Content-Type": "application/json"}

metadata_collections = {
    "document_metadata": "workflowai_documents_metadata_collection",
    "clone_metadata": "workflowai_clones_metadata_collection",
    "template_metadata": "workflowai_templates_metadata_collection",
}

normal_collections = {
    "process": "workflowai_process_collection",
    "document": "workflowai_document_collection",
    "clone": "workflowai_clone_collection",
    "template": "workflowai_template_collection",
    "qrcode": "workflowai_qrcode_collection",
    "link": "workflowai_link_collection",
    "folder": "workflowai_folder_collection",
}


master_collections = {
    "template": "workflowai_master_template_collection",
    "workflow": "workflowai_master_workflow_collection",
    "process": "workflowai_master_process_collection",
    "document": "workflowai_master_document_collection",
    "clone": "workflowai_master_clone_collection",
    "qrcode": "workflowai_master_qrcode_collection",
    "link": "workflowai_master_link_collection",
    "folder": "workflowai_master_folder_collection",
    "master_link": "workflowai_master_link_collection",
    "public_id": "workflowai_master_public_id_collection",
}


class CustomDict(dict):
    def __init__(self, workspace_id, initial_dict: dict = None):
        super().__init__()
        self.workspace_id = workspace_id
        if initial_dict:
            for key, value in initial_dict.items():
                self[key] = f"{self.workspace_id}_{value}"


def post_to_data_service(url: str, data: dict):
    """posts data to an API endpoint

    Args:
        url (str): api endpoint
        data (dict): data to post

    Returns:
        dict: json response
    """
    response = requests.post(url=url, data=data, headers=headers)
    return json.loads(response.text)


def get_master_db(workspace_id):
    return f"{workspace_id}_master_db"


def make_db_name(value: str):
    if not value:
        return

    value = value.replace(" ", "_")
    trailing = uuid4().hex[:4]
    return f"{value}_db_{trailing}"


def check_collections(dc_connect: "DatacubeConnection", needed_collections: list):
    """
    Helper method to check for missing collections and create them if necessary.
    """
    response_data = dc_connect.datacube_collection_retrieval()
    if not response_data["success"]:
        return False, "Database is not yet available, kindly contact the administrator"

    ready_collections = response_data["data"][0] if response_data["data"] else []
    missing_collections = [coll for coll in needed_collections if coll not in ready_collections]

    for coll in missing_collections:
        res = dc_connect.add_collection_to_database(coll)
        if not res["success"]:
            return False, f"unable to create collection {coll}"
    return True, "Collections are ready"


def create_db(*, api_key, workspace_id, database, **kwargs):
    """Will hopefully create a new database entity later on.
        For now just checks and creates necessary collections in the given database

    Args:
        api_key: api key
        workspace_id: workspace_id
        database: the new database created for the new template
        kwargs (_dict_): other keyword arguments to create db
    """
    # TODO refactor later
    url = "https://datacube.uxlivinglab.online/db_api/collections/"
    payload = {"api_key": api_key, "db_name": database, "payment": False}
    response = requests.get(url, json=payload)
    res = json.loads(response.content)
    if res["success"]:
        dc_connect = DatacubeConnection(api_key, workspace_id, database, check=False)
        needed_collections = list(
            CustomDict(workspace_id, normal_collections | metadata_collections).values()
        )
        success, message = check_collections(dc_connect, needed_collections)
        if not success:
            raise CustomAPIException(message, 501)

        # TODO check if there is already a template in this database

        return database

    raise NotFound(f"{database} not found")


class DatacubeConnection:

    def __init__(
        self,
        api_key: str,
        workspace_id: str,
        database: str = None,
        check=True,
        workflow=False,
        public_id=False,
    ) -> None:
        """
        api_key (str): the API key
        workspace_id (str): workspace_id
        database (str): database name
        check (str): determines if the db should be checked for in the master template collection
        workflow (bool): determines if class is being instantiated for workflows
        public_id (bool): determines if class is being instantiated for public ids

        Note that if check false then either workflow or public_id should be true
        or there will be no database attribute set
        """
        self.api_key = api_key
        self.workspace_id = workspace_id
        self.collection_names = self.normal_collection_names | self.metadata_collections
        self.master_template_collection = self.master_collections["template"]
        self.workflow_db = f"{workspace_id}_workflowai_workflow_db"
        self.public_id_db = f"{workspace_id}_workflowai_public_id_db"
        self.master_links_db = f"{workspace_id}_workflowai_master_links_db"
        self.master_template_data = None
        # Since this is instantiated for workflows and public_ids
        # no need for a db since we know workflow db and public_id db
        if workflow:
            self.database = self.workflow_db

        elif public_id:
            self.database = self.public_id_db

        elif check:
            self.master_template_data = self.check_db(database)
            self.database = database

        elif not database:
            raise Exception(
                "if check false then either workflow or public_id should be true \
                or there will be no database attribute set"
            )

        else:
            self.database = database

    @property
    def metadata_collections(self):
        return CustomDict(self.workspace_id, metadata_collections)

    @property
    def normal_collection_names(self):
        return CustomDict(self.workspace_id, normal_collections)

    @property
    def master_collections(self):
        return CustomDict(self.workspace_id, master_collections)

    @property
    def master_db(self):
        return get_master_db(self.workspace_id)

    def check_db(self, database):
        filters = {"database": database}
        db_data = self.get_templates_from_master_db(filters=filters, single=True)["data"]

        if not db_data:
            raise NotFound(f"{database} not found")

        return db_data[0]

    def add_collection_to_database(self, collections: str, num_of_collections=1, **kwargs):
        """adds collection(s) to a database

        Args:
            collections (str): comma separated list of collection names to be created
            num_of_collections (int): number of collections to be added
        """
        url = f"{DB_API}/add_collection/"
        database: str = kwargs.get("database", self.database)
        payload = json.dumps(
            {
                "api_key": self.api_key,
                "db_name": database,
                "coll_names": collections,
                "num_collections": num_of_collections,
            }
        )
        response = post_to_data_service(url=url, data=payload)
        return response

    def get_data_from_collection(
        self, collection: str, filters: dict = {}, limit=5, offset=0, database=None, **kwargs
    ):
        """_summary_

        Args:
            collection (str): collection name
            filters (dict): a dictionary of all the filter parameters
            limit (int, optional): max number of results per page. Defaults to 5.
            offset (int, optional): page number . Defaults to 0.
        """
        url = f"{DB_API}/get_data/"
        if database is None:
            database = self.database

        payload = {
            "api_key": self.api_key,
            "db_name": database.lower(),
            "coll_name": collection,
            "operation": "fetch",
            "filters": filters,
            "limit": limit,
            "offset": offset,
        }

        response = requests.post(url, json=payload)
        res = json.loads(response.text)
        return res

    def post_data_to_collection(
        self, collection: str, data: dict, operation: str, query: dict = None, **kwargs
    ):
        database = kwargs.get("database", self.database)
        payload_dict = {
            "api_key": self.api_key,
            "db_name": database.lower(),
            "coll_name": collection,
            "operation": operation,
            "payment": False,
        }
        if operation.lower() == "insert":
            # all insertions need to have database attached except workflow
            # since workflow has it's own db
            if not kwargs.get("workflow"):
                data["database"] = self.database
            payload_dict["data"] = data
            payload = payload_dict
            payload.update({"records": [{"record": "1", "type": "overall"}]})

            # add the db for reference
            response = requests.post(DB_API_CRUD, json=payload)

        elif operation.lower() == "update":
            payload_dict["update_data"] = data
            data.pop("template_id", None)
            payload_dict["query"] = query
            payload = payload_dict
            response = requests.put(DB_API_CRUD, json=payload)

        elif operation.lower() == "delete":
            payload_dict["query"] = query
            payload = payload_dict
            response = requests.delete(DB_API_CRUD, json=payload)

        res = json.loads(response.text)
        return res

    def datacube_collection_retrieval(self, **kwargs):
        """
        Retrieve a list of collections in the DataCube database.

        :param api_key: The API key for authentication.
        :param db_name: The name of the database (Optional).
        :return: The response text from the server.
        """
        database: str = kwargs.get("database", self.database)
        url = "https://datacube.uxlivinglab.online/db_api/collections/"
        payload = {"api_key": self.api_key, "db_name": database.lower(), "payment": False}
        response = requests.get(url, json=payload)
        res = json.loads(response.content)
        print("payload: ", payload)
        return res

    def save_to_metadata(self, collection_id: str, data: dict, **kwargs):
        return self.post_data_to_collection(
            collection=collection_id,
            data=data,
            operation="insert",
            **kwargs,
        )

    def save_to_workflow_collection(self, data: dict, **kwargs):
        collection = self.master_collections["workflow"]
        return self.post_data_to_collection(
            collection=collection,
            data=data,
            operation="insert",
            database=self.workflow_db,
            workflow=True,
            **kwargs,
        )

    def update_workflow_collection(self, workflow_id: str, data: dict, **kwargs):
        query = {"_id": workflow_id}
        collection = self.master_collections["workflow"]
        return self.post_data_to_collection(
            collection, data, "update", query, database=self.workflow_db, workflow=True, **kwargs
        )

    def get_workflows_from_collection(self, filters=None, single=False, **kwargs):
        """
        Retrieves workflows from the workflow collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected workflow(s) from the collection.
        """
        collection = self.master_collections["workflow"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(
                collection,
                filters,
                limit=limit,
                database=self.workflow_db,
                workflow=True,
                **kwargs,
            )
        else:
            return self.get_data_from_collection(
                collection, filters, database=self.workflow_db, workflow=True, **kwargs
            )

    def save_to_clone_collection(self, data: dict, **kwargs):
        if kwargs.get("metadata") == True:
            collection = self.collection_names["clone_metadata"]
        else:
            collection = self.collection_names["clone"]

        return self.post_data_to_collection(
            collection=collection, data=data, operation="insert", **kwargs
        )

    def save_to_clone_metadata_collection(self, *args, **kwargs):
        return self.save_to_clone_collection(*args, metadata=True, **kwargs)
        if res["success"]:
            data = kwargs.get("data")
            if not data:
                try:
                    data = args[0]
                except:
                    return res
            self.save_clone_to_master_db(data=data, response=res)
        return res

    def save_clone_to_master_db(self, data: dict, response: dict, **kwargs):
        database = get_master_db(self.workspace_id)
        master_data = {
            "document_name": data["document_name"],
            "clone_id": data["collection_id"],
            "clone_metadata_id": response["data"]["inserted_id"],
            "database": self.database,
        }
        master_res = self.post_data_to_collection(
            self.master_collections["clone"], master_data, "insert", database=database, **kwargs
        )
        if not master_res["success"]:
            pass

        return master_res

    def update_clone_collection(self, clone_id: str, data: dict, query=None, **kwargs):
        if query is None:
            query = {"_id": clone_id}

        if kwargs.get("metadata") == True:
            collection = self.collection_names["clone_metadata"]
        else:
            collection = self.collection_names["clone"]

        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def update_clone_metadata_collection(self, metadata_id: str, data: dict, *args, **kwargs):
        return self.update_clone_collection(
            *args, clone_id=metadata_id, data=data, metadata=True, **kwargs
        )

    def get_clones_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves clones from the clone collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected clone(s) from the collection.
        """
        # NOTE: confirm
        if kwargs.get("metadata") == True:
            collection = self.collection_names["clone_metadata"]
        else:
            collection = self.collection_names["clone"]

        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    def get_clones_metadata_from_collection(self, *args, **kwargs):
        """
        Retrieves clone metadata from the clone collection
        \n This method is a wrapper for `get_clones_from_collection` that ensures metadata
        is retrieved for the clones.
        """
        return self.get_clones_from_collection(*args, metadata=True, **kwargs)

    def save_to_qrcode_collection(self, data: dict, **kwargs):
        collection = self.collection_names["qrcode"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def get_qrcodes_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves qrcodes from the qrcode collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected qrcode(s) from the collection.
        """
        collection = self.collection_names["qrcode"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    def save_to_process_collection(self, data: dict, **kwargs):
        collection = self.collection_names["process"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)
        if res["success"]:
            master_data = {
                "process_title": data["process_title"],
                "process_id": res["data"]["inserted_id"],
            }
            master_res = self.post_data_to_collection(
                self.master_collections["process"],
                master_data,
                "insert",
                database=self.master_db,
                **kwargs,
            )

            if not master_res["success"]:
                pass

        return res

    def update_process_collection(self, process_id: str, data: dict, query=None, **kwargs):
        if query is None:
            query = {"_id": process_id}
        collection = self.collection_names["process"]
        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def get_processes_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves process from the process collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected process(es) from the collection.
        """
        collection = self.collection_names["process"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    def save_to_document_collection(self, data: dict, **kwargs):
        if kwargs.get("metadata") == True:
            collection = self.collection_names["document_metadata"]
        else:
            collection = self.collection_names["document"]

        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def save_to_document_metadata_collection(self, *args, **kwargs):
        """
        Saves to document metadata collection
        \n This method is a wrapper for `save_to_document_collection` that ensures document
        is saved to the metadata collection.
        """
        return self.save_to_document_collection(*args, metadata=True, **kwargs)
        if res["success"]:
            data = kwargs.get("data")
            if not data:
                try:
                    data = args[0]
                except:
                    return res
            self.save_document_to_master_db(data=data, response=res)

        return res

    def save_document_to_master_db(self, data: dict, response: dict, **kwargs):
        database = get_master_db(self.workspace_id)
        master_data = {
            "document_name": data["document_name"],
            "document_id": data["collection_id"],
            "document_metadata_id": response["data"]["inserted_id"],
            "database": self.database,
        }
        master_res = self.post_data_to_collection(
            self.master_collections["document"], master_data, "insert", database=database, **kwargs
        )
        if not master_res["success"]:
            pass

        return master_res

    def update_document_collection(self, document_id: str, data: dict, query=None, **kwargs):
        if query is None:
            query = {"_id": document_id}

        if kwargs.get("metadata") == True:
            collection = self.collection_names["document_metadata"]
        else:
            collection = self.collection_names["document"]

        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def update_document_metadata_collection(self, metadata_id: str, data: dict, *args, **kwargs):
        return self.update_document_collection(
            *args, document_id=metadata_id, data=data, metadata=True, **kwargs
        )

    def get_documents_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves documents from the document collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected document(s) from the collection.
        """
        if kwargs.get("metadata") == True:
            collection = self.collection_names["document_metadata"]
        else:
            collection = self.collection_names["document"]

        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    def get_documents_metadata_from_collection(self, *args, **kwargs):
        """
        Retrieves document metadata from the document collection
        \n This method is a wrapper for `get_documents_from_collection` that ensures metadata
        is retrieved for the documents.
        """
        return self.get_documents_from_collection(*args, metadata=True, **kwargs)

    def get_documents_from_master_db(self, **kwargs):
        database = self.master_db
        collection = self.master_collections["document"]
        return self.get_data_from_collection(collection, database=database, **kwargs)

    def save_to_template_collection(self, data: dict, **kwargs):
        if kwargs.get("metadata") == True:
            collection = self.collection_names["template_metadata"]
        else:
            collection = self.collection_names["template"]

        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def save_to_template_metadata_collection(self, *args, **kwargs):
        """
        Saves to template metadata collection
        \n This method is a wrapper for `save_to_template_collection` that ensures template
        is saved to the metadata collection.
        """
        res = self.save_to_template_collection(*args, metadata=True, **kwargs)
        # on metadata insertion success we save to master collection
        if res["success"]:
            data = kwargs.get("data")
            if not data:
                try:
                    data = args[0]
                except:
                    return res
            self.save_template_to_master_db(data=data, response=res)

        return res

    def save_template_to_master_db(self, data: dict, response: dict, **kwargs):
        database = get_master_db(self.workspace_id)
        master_db_data = {
            "template_name": data["template_name"],
            "template_id": data["collection_id"],
            "template_metadata_id": response["data"].get("inserted_id"),
            "database": self.database,
            "approval": False,
        }
        master_res = self.post_data_to_collection(
            self.master_template_collection, master_db_data, "insert", database=database, **kwargs
        )

        if not master_res["success"]:
            # FIXME what happens here
            pass

        return master_res

    def update_template_collection(self, template_id: str, data: dict, query=None, **kwargs):
        if query is None:
            query = {"_id": template_id}

        if kwargs.get("master") == True:
            collection = self.master_template_collection

        elif kwargs.get("metadata") == True:
            collection = self.collection_names["template_metadata"]

        else:
            collection = self.collection_names["template"]

        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def update_template_metadata_collection(self, metadata_id: str, data: dict, *args, **kwargs):
        return self.update_template_collection(
            *args, template_id=metadata_id, data=data, metadata=True, **kwargs
        )

    def update_master_template_collection(self, template_id: str, data: dict, *args, **kwargs):
        query = {"template_id": template_id}
        database = get_master_db(self.workspace_id)
        return self.update_template_collection(
            *args,
            template_id=template_id,
            data=data,
            query=query,
            master=True,
            database=database,
            **kwargs,
        )

    def get_templates_from_master_db(self, filters=None, single=False, **kwargs):
        """
        Using thi method always returns templates from the `master db`
        regardless of which db was used to init.
        """
        database = get_master_db(self.workspace_id)
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(
                self.master_template_collection, filters, limit=limit, database=database, **kwargs
            )
        else:
            return self.get_data_from_collection(
                self.master_template_collection, filters, database=database, **kwargs
            )

    # FIXME we have everything we need to get the template data so no need to pass anything
    def get_templates_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves templates from the template collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected template(s) from the collection.
        """
        if kwargs.get("metadata") == True:
            collection = self.collection_names["template_metadata"]
        else:
            collection = self.collection_names["template"]

        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    # FIXME create custom query for metadata since only one metadata per template metadata collection
    def get_templates_metadata_from_collection(self, *args, **kwargs):
        """
        Retrieves template metadata from the template collection
        \n This method is a wrapper for `get_templates_from_collection` that ensures metadata
        is retrieved for the templates.
        """
        return self.get_templates_from_collection(*args, metadata=True, **kwargs)

    def save_to_master_links_collection(self, data: dict, **kwargs):
        collection = self.master_collections["link"]
        res = self.post_data_to_collection(
            collection, data, "insert", database=self.master_links_db, **kwargs
        )
        return res

    def update_master_links_collection(
        self, master_link_id: str, data: dict, query: dict = None, **kwargs
    ):
        collection = self.master_collections["link"]
        if query is None:
            query = {"master_link_id": master_link_id}

        return self.post_data_to_collection(
            collection, data, "update", query, database=self.master_links_db, **kwargs
        )

    def get_links_from_master_collection(self, filters: dict, single=False, **kwargs):
        collection = self.master_collections["link"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(
                collection, filters, limit=limit, database=self.master_links_db, **kwargs
            )
        else:
            return self.get_data_from_collection(
                collection, filters, database=self.master_links_db, **kwargs
            )

    def save_to_links_collection(self, data: dict, **kwargs):
        collection = self.collection_names["link"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def update_links_collection(self, link_id: str, data: dict, query=None, **kwargs):
        if query is None:
            query = {"_id": link_id}
        collection = self.collection_names["link"]
        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def get_links_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves links from the link collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected link(s) from the collection.
        """
        # NOTE confirm links collection
        collection = self.collection_names["link"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    def save_to_folder_collection(self, data: dict, **kwargs):
        collection = self.collection_names["folder"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)
        if res["success"]:
            master_data = {
                "folder_name": data["folder_name"],
                "folder_id": res["data"]["inserted_id"],
            }
            master_res = self.post_data_to_collection(
                self.master_collections["folder"],
                master_data,
                "insert",
                database=self.master_db,
                **kwargs,
            )

            if not master_res["success"]:
                pass

        return res

    def get_folders_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves folders from the folder collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.\
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected folder(s) from the collection.
        """
        collection = self.collection_names["folder"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

    def get_used_public_ids(self, num: int, filters: dict = None, **kwargs):
        """
        Retrieves used public ids from the public id collection.

        Args:
            filters (dict): _description.
            num (int): number of public ids to return
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected public id(s) from the collection.
        """
        if filters is None:
            filters = {"used": True}

        public_ids = PublicId.dc_objects.filter(workspace_id=self.workspace_id, **filters)[:num]
        return PublicIdSerializer(public_ids).data

    def get_unused_public_ids(self, num: int, filters: dict = None, **kwargs):
        """
        Retrieves unused public ids from the public id collection.

        Args:
            filters (dict): _description.
            num (int): number of public ids to return
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected public id(s) from the collection.
        """
        if filters is None:
            filters = {"used": False}

        public_ids = PublicId.dc_objects.filter(workspace_id=self.workspace_id, **filters)[:num]
        return PublicIdSerializer(public_ids).data

    def save_to_public_id_collection(self, data: list, **kwargs):
        to_save = []
        for item in data:
            to_save.append(PublicId(workspace_id=self.workspace_id, public_id=item))

        ids = PublicId.dc_objects.bulk_create(to_save, ignore_conflicts=True)
        # NOTE confirm if needed
        if len(ids) != len(data):
            difference = len(data) - ids.count()
            to_save = []
            for _ in range(difference):
                to_save.append(
                    PublicId(workspace_id=self.workspace_id, public_id=secrets.token_urlsafe(12))
                )
            ids2 = PublicId.objects.bulk_create(to_save)
            ids += ids2
        
        return PublicIdSerializer(ids).data

    def update_public_id_collection(self, public_id: str, data: dict, **kwargs):
        try:
            instance = PublicId.dc_objects.get(workspace_id=self.workspace_id, public_id=public_id)
        except PublicId.DoesNotExist:
            return {"success": False, "message": "Public ID not found", "data": []}
        
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        
        instance.save()
        return PublicIdSerializer([instance]).data

    def authorize(self, document_id, viewers, process_id, item_type, **kwargs):
        payload = None
        metadata_payload = None
        if item_type == "document":
            if isinstance(viewers, list):
                payload = {
                    "auth_viewers": viewers,
                    "document_state": "processing",
                    "process_id": process_id,
                }
                metadata_payload = {
                    "auth_viewers": viewers,
                    "document_state": "processing",
                    "process_id": process_id,
                }
            else:
                payload = {
                    "auth_viewers": [viewers],
                    "document_state": "processing",
                    "process_id": process_id,
                }
                metadata_payload = {
                    "auth_viewers": [viewers],
                    "document_state": "processing",
                    "process_id": process_id,
                }
        if item_type == "template":
            payload = {
                "auth_viewers": [viewers],
                "template_state": "draft",
                "process_id": process_id,
            }
        if payload is not None:
            if metadata_payload is not None:
                metadata_clone_res = self.update_clone_metadata_collection(
                    document_id, metadata_payload, **kwargs
                )
            clone_res = self.update_clone_collection(document_id, metadata_payload, **kwargs)

            return clone_res

        return

    def check_if_name_exists_collection(self, collection_name, **kwargs):
        res = self.datacube_collection_retrieval(**kwargs)
        base_name = re.sub(r"_\d+$", "", collection_name)
        if res["success"]:
            # THIS SHOULD WORK AS WELL
            # if not [collection_name in item for item in res["data"][0]]:
            #     print("essssss: ", res["data"][0])
            #     new_collection_name = generate_unique_collection_name(res["data"][0], base_name)
            if collection_name not in res["data"][0]:
                new_collection_name = generate_unique_collection_name(res["data"][0], base_name)
                return {
                    "name": new_collection_name,
                    "success": True,
                    "Message": "New_name_generated",
                    "status": "New",
                }
            else:
                return {
                    # "name": [item for item in res["data"][0] if collection_name in item][0],
                    "name": collection_name,
                    "success": True,
                    "Message": "template_generated",
                    "status": "Existing",
                }
        else:
            return {
                "success": False,
                "Message": res["message"],
                "Url": "https://datacube.uxlivinglab.online/",
            }

    def access_editor(self, item_id, item_type, username="", portfolio="", email="", **kwargs):
        team_member_id = (
            "11689044433"
            if item_type == "document"
            else "1212001" if item_type == "clone" else "22689044433"
        )
        if item_type == "document":
            collection = "DocumentReports"
            document = "documentreports"
            field = "document_name"
        if item_type == "clone":
            collection = "CloneReports"
            document = "CloneReports"
            field = "document_name"
        elif item_type == "template":
            collection = "TemplateReports"
            document = "templatereports"
            field = "template_name"

        # FIXME we can accept the document object instead of id to avoid multiple api calls
        if item_type == "document":
            item_name = self.get_documents_from_collection({"_id": item_id}, single=True, **kwargs)
        elif item_type == "clone":
            item_name = self.get_clones_from_collection({"_id": item_id}, single=True, **kwargs)
        else:
            item_name = self.get_templates_from_collection({"_id": item_id}, single=True, **kwargs)

        name = item_name.get(field, "")
        now = str(datetime.now(UTC))
        payload = {
            "product_name": "Workflow AI",
            "details": {
                "cluster": "Documents",
                "database": "Documentation",
                "collection": collection,
                "document": document,
                "team_member_ID": team_member_id,
                "function_ID": "ABCDE",
                "_id": item_id,
                "field": field,
                "type": item_type,
                "action": (
                    "document"
                    if item_type == "document"
                    else "clone" if item_type == "clone" else "template"
                ),
                "flag": "editing",
                "name": name,
                "username": username,
                "portfolio": portfolio,
                "email": email,
                "time": now,
                "command": "update",
                "update_field": {
                    field: "",
                    "content": "",
                    "page": "",
                    "edited_by": username,
                    "portfolio": portfolio,
                    "edited_on": now,
                },
            },
        }
        try:
            response = requests.post(
                EDITOR_API,
                data=json.dumps(payload),
                headers={"Content-Type": "application/json"},
            )
            return response.json()
        except Exception as e:
            print(e)
            return

    def cloning_document(
        self, document_id, auth_viewers, parent_id, process_id, *, public_id=None, **kwargs
    ):
        try:
            viewers = []
            for m in auth_viewers:
                viewers.append(m["member"])

            document = self.get_documents_from_collection(
                filters={"_id": document_id}, single=True, **kwargs
            )["data"][0]
            # Create new "signed" list to track users who have signed the document
            signed = []
            for item in auth_viewers:
                mem = item["member"]
                signed.append({mem: False})

            for viewer in viewers:
                doc_name = document["document_name"]
                if not doc_name:
                    document_name = "doc - " + viewer
                else:
                    if isinstance(viewer, dict):
                        document_name = doc_name + "_" + viewer["member"]
                    else:
                        document_name = doc_name + "_" + viewer

            save_res = self.save_to_clone_collection(
                data={
                    "document_name": document_name,
                    "content": document["content"],
                    "page": document["page"],
                    "created_by": document["created_by"],
                    "company_id": document["company_id"],
                    "data_type": document["data_type"],
                    "document_state": "processing",
                    "auth_viewers": auth_viewers,
                    "document_type": "clone",
                    "document_state": "processing",
                    "parent_id": parent_id,
                    "process_id": process_id,
                    "folders": "untitled",
                    "message": "",
                    "signed_by": signed,
                    "public_id": public_id,
                },
                **kwargs,
            )

            if save_res["success"]:
                save_res_metadata = self.save_to_clone_metadata_collection(
                    data={
                        "document_name": document_name,
                        "collection_id": save_res["data"]["inserted_id"],
                        "created_by": document["created_by"],
                        "company_id": document["company_id"],
                        "data_type": document["data_type"],
                        "auth_viewers": auth_viewers,
                        "document_type": "clone",
                        "document_state": "processing",
                        "process_id": process_id,
                        "parent_id": parent_id,
                        "signed_by": signed,
                    },
                    **kwargs,
                )

            return save_res["data"]["inserted_id"]
        except Exception as e:
            print(e)
            return

    def cloning_clone(self, clone_id, auth_viewers, parent_id, process_id, **kwargs):
        try:
            viewers = []
            for m in auth_viewers:
                viewers.append(m["member"])
            document = self.get_documents_from_collection(
                {"_id": clone_id}, single=True, **kwargs
            )["data"][0]
            for viewer in viewers:
                doc_name = document["document_name"]
                if not doc_name:
                    document_name = "doc - " + viewer
                else:
                    if isinstance(viewer, dict):
                        document_name = doc_name + "_" + viewer["member"]
                    else:
                        document_name = doc_name + "_" + viewer

            clone_dict = {
                "document_name": document_name,
                "content": document["content"],
                "page": document["page"],
                "created_by": document["created_by"],
                "company_id": document["company_id"],
                "data_type": document["data_type"],
                "document_state": "processing",
                "auth_viewers": auth_viewers,
                "document_type": "clone",
                "document_state": "processing",
                "parent_id": parent_id,
                "process_id": process_id,
                "folders": "untitled",
                "message": "",
            }
            if document.get("signed_by"):
                clone_dict["signed_by"] = document["signed_by"]

            save_res = self.save_to_clone_collection(clone_dict, **kwargs)

            if save_res["success"]:
                metadata_dict = {
                    "document_name": document_name,
                    "collection_id": save_res["inserted_id"],
                    "created_by": document["created_by"],
                    "company_id": document["company_id"],
                    "data_type": document["data_type"],
                    "auth_viewers": auth_viewers,
                    "document_type": "clone",
                    "document_state": "processing",
                    "parent_id": parent_id,
                    "process_id": process_id,
                }
                if document.get("signed_by"):
                    metadata_dict["signed_by"] = document["signed_by"]

                save_res_metadata = self.save_to_clone_metadata_collection(metadata_dict, **kwargs)
            return save_res["inserted_id"]
        except Exception as e:
            print(e)
            return

    def access_editor_metadata(self, item_id, item_type, metadata_id, email, **kwargs):
        team_member_id = (
            "11689044433"
            if item_type == "document"
            else "1212001" if item_type == "clone" else "22689044433"
        )
        if item_type == "document":
            # collection = "DocumentReports"
            collection = self.collection_names["document_metadata"]
            document = "documentreports"
            field = "document_name"

        if item_type == "clone":
            # collection = "CloneReports"
            collection = self.collection_names["clone_metadata"]
            document = "CloneReports"
            field = "document_name"

        elif item_type == "template":
            # collection = "TemplateReports"
            collection = self.collection_names["template_metadata"]
            document = "templatereports"
            field = "template_name"

        if item_type == "document":
            # NOTE compare
            item_name = self.get_documents_metadata_from_collection(
                {"collection_id": item_id}, **kwargs
            )

        elif item_type == "clone":
            item_name = self.get_clones_metadata_from_collection(
                {"collection_id": item_id}, **kwargs
            )

        else:
            item_name = self.get_templates_metadata_from_collection(
                {"collection_id": item_id}, **kwargs
            )

        # NOTE confirm
        if not item_name["data"]:
            return

        item_name = item_name["data"][0]
        name = item_name.get(field, "")
        payload = {
            "product_name": "Workflow AI",
            "details": {
                "cluster": "Documents",
                "database": "Documentation",
                "collection": collection,
                "document": document,
                "team_member_ID": team_member_id,
                "email": email,
                "function_ID": "ABCDE",
                "_id": item_id,
                "metadata_id": metadata_id,
                "field": field,
                "type": item_type,
                "action": (
                    "document"
                    if item_type == "document"
                    else "clone" if item_type == "clone" else "template"
                ),
                "flag": "editing",
                "name": name,
                "command": "update",
                "update_field": {field: "", "content": "", "page": ""},
            },
        }
        try:
            response = requests.post(
                EDITOR_API,
                data=json.dumps(payload),
                headers={"Content-Type": "application/json"},
            )
            return response.json()
        except Exception as e:
            print(e)
            return

    def cloning_process(self, process_id, created_by, creator_portfolio, **kwargs):
        try:
            # NOTE confirm if correct collection for get and save
            process = self.get_processes_from_collection(
                {"_id": process_id}, single=True, **kwargs
            )["data"]
            process = process[0]
            save_res = self.save_to_process_collection(
                {
                    "process_title": process["process_title"],
                    "process_steps": process["process_steps"],
                    "created_by": created_by,
                    "company_id": process["company_id"],
                    "data_type": process["data_type"],
                    "parent_item_id": "no_parent_id",
                    "processing_action": process["processing_action"],
                    "creator_portfolio": creator_portfolio,
                    "workflow_construct_ids": process["workflow_construct_ids"],
                    "process_type": process["process_type"],
                    "process_kind": "clone",
                    "processing_state": "draft",
                },
                **kwargs,
            )

            return save_res["data"]["inserted_id"]
        except Exception as e:
            print(e)
            return

    def finalize_item(
        self, item_id: str, state: str, item_type: str, message: str, signers=None, **kwargs
    ):
        def check_signers(data):
            if signers is not None:
                data["signed_by"] = signers
            return data

        if item_type == "document":
            update_data = {"document_state": state, "message": message}
            return self.update_document_collection(item_id, check_signers(update_data), **kwargs)

        elif item_type == "clone":
            update_data = {"document_state": state, "message": message}
            return self.update_clone_collection(item_id, check_signers(update_data), **kwargs)

        elif item_type == "template":
            update_data = {"template_state": state, "message": message}
            return self.update_template_collection(item_id, check_signers(update_data), **kwargs)

        elif item_type == "workflow":
            update_data = {"document_state": state}
            return self.update_workflow_collection(item_id, check_signers(update_data), **kwargs)

        return

    def check_user_in_auth_viewers(self, user, item, item_type, **kwargs) -> bool:
        auth_viewers = []
        if item_type == "document":
            viewers = self.get_clones_from_collection({"_id": item}, single=True, **kwargs)[
                "data"
            ][0].get("auth_viewers")

        elif item_type == "template":
            viewers = self.get_templates_from_collection({"_id": item}, single=True, **kwargs)[
                "data"
            ][0].get("auth_viewers")
            viewers = viewers[0]

        for i in viewers:
            if isinstance(i, list):
                # if item comes as a list, get the first item
                i = i[0]

            for k, v in i.items():
                if k != "portfolio":
                    auth_viewers.append(v)

        if user in auth_viewers:
            return True
        else:
            return False

    def check_step_items_state(self, items, **kwargs) -> bool:
        doc_states = []
        for i in items:
            doc_state = self.get_clones_from_collection({"_id": i}, single=True, **kwargs)["data"][
                0
            ].get("document_state")
            if doc_state == "finalized":
                doc_states.append(True)
            elif doc_state == "processing":
                doc_states.append(False)
            else:
                doc_states.append(False)
        if not all(doc_states):
            return False
        return True

    def get_metadata_id(self, item_id, item_type, **kwargs):
        if item_type == "document":
            try:
                coll_id = self.get_documents_metadata_from_collection(
                    {"collection_id": item_id}, single=True, **kwargs
                )["data"][0]["_id"]
                return coll_id
            except Exception as err:
                print(err)
        elif item_type == "clone":
            try:
                coll_id = self.get_clones_metadata_from_collection(
                    {"collection_id": item_id}, single=True, **kwargs
                )["data"][0]["_id"]
                return coll_id
            except Exception as err:
                print(err)

        elif item_type == "template":
            try:
                coll_id = self.get_templates_metadata_from_collection(
                    {"collection_id": item_id}, **kwargs
                )["data"][0]["_id"]
                return coll_id
            except Exception as err:
                print(err)

    def authorize_metadata(self, metadata_id, viewers, process_id, item_type, **kwargs):
        query = {"_id": metadata_id}
        update_data = {
            "auth_viewers": [viewers],
            "document_state": "processing",
            "process_id": process_id,
        }
        if item_type == "document":  # document here is process_type
            return self.update_clone_metadata_collection(
                metadata_id, update_data, query=query, **kwargs
            )
        if item_type == "template":
            return self.update_template_metadata_collection(
                metadata_id, update_data, query=query, **kwargs
            )

        return

    def check_all_finalized_true(self, data, process_type, **kwargs) -> bool:
        for item in data:
            step_document_clone_map = item.get("stepDocumentCloneMap", [])
            doc_states = []
            for doc in step_document_clone_map:
                for key, value in doc.items():
                    if key != "accessed":
                        if process_type == "document" or process_type == "internal":
                            doc_state = self.get_clones_from_collection(
                                {"_id": value}, single=True, **kwargs
                            )["data"][0].get("document_state")

                            if doc_state == "finalized":
                                doc_states.append(True)
                            elif doc_state == "processing":
                                doc_states.append(False)
                            else:
                                doc_states.append(False)

                        elif process_type == "template":
                            doc_state = self.get_templates_from_collection(
                                {"_id": value}, single=True, **kwargs
                            )["data"][0].get("template_state")

                            if doc_state == "saved":
                                doc_states.append(True)
                            elif doc_state == "draft":
                                doc_states.append(False)
                            else:
                                doc_states.append(False)

            if not all(doc_states):
                return False

        return True

    def update_metadata(self, item_id, state, item_type, signers=None, **kwargs):
        def check_signers(data):
            if signers is not None:
                data["signed_by"] = signers
            return data

        if item_type == "document":
            data = {"document_state": state}
            return self.update_document_metadata_collection(item_id, check_signers(data), **kwargs)

        elif item_type == "clone":
            data = {"document_state": state}
            return self.update_clone_metadata_collection(item_id, check_signers(data), **kwargs)

        elif item_type == "template":
            data = {"template_state": state}
            return self.update_template_metadata_collection(item_id, check_signers(data), **kwargs)

        return

    def validate_enough_users(self, num: int) -> list:
        return []

    def generate_public_qrcode(self, links, document_name, clone_ids, **kwargs):
        request = kwargs.get("request")
        token = encrypt_credentials(api_key=self.api_key, workspace_id=self.workspace_id)
        if not token:
            raise CustomAPIException("Error creating master link", 503)
        master_link_id = str(uuid1().int >> 64)
        master_link = request.build_absolute_uri(
            reverse("master_link", kwargs={"link_id": master_link_id, "token": token})
        )
        qr_code = qrcode.QRCode(
            version=1, error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=10, border=4
        )
        qr_code.add_data(master_link)
        qr_code.make(fit=True)
        img_qr = qr_code.make_image(fill_color="#000000", back_color="white")
        bytes_io = io.BytesIO()
        img_qr.save(bytes_io)
        img_qr_bytes = bytes_io.getvalue()
        timestamp = int(time())
        filename = f"qrcode_{timestamp}.png"
        master_data = {
            "master_link_id": master_link_id,
            "master_link": master_link,
            "database": self.database,
            "document_name": document_name,
        }
        master_res = self.save_to_master_links_collection(data=master_data)
        if master_res["success"]:
            qr_code_url = upload_image_to_interserver(img_qr_bytes, filename)
            for i in links:
                link_data = {
                    "process_id": i["process_id"],
                    "item_id": i["item_id"],
                    "master_link_id": master_link_id,
                    "clone_ids": clone_ids,
                    "company_id ": self.workspace_id,
                    "link": i["link"],
                    "auth_role": i["auth_role"],
                    "user_name": i["user_name"],
                    "auth_portfolio": i["auth_portfolio"],
                    "unique_hash": i["unique_hash"],
                    "item_type": i["item_type"],
                    "is_opened": False,
                    "is_finalized": False,
                }

                self.save_to_links_collection(link_data)

            return master_link, qr_code_url
        print(master_res)
        raise CustomAPIException("Error creating master link", 503)

    def register_finalized(self, link_id):
        data = {"is_finalized": True}
        return self.update_links_collection(link_id, data)
