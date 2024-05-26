import json
import re
from datetime import UTC, datetime
from uuid import uuid4

import requests
from rest_framework.exceptions import NotFound

from app.constants import EDITOR_API
from education.constants import DB_API, DB_API_CRUD
from education.helpers import generate_unique_collection_name

headers = {"Content-Type": "application/json"}


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
    return f"{workspace_id}_master_db_0"


def make_db_name(value: str):
    if not value:
        return

    value = value.replace(" ", "_")
    trailing = uuid4().hex[:4]
    return f"{value}_db_{trailing}"


def create_db(*, api_key, workspace_id, template_name, **kwargs):
    """Creates a new database entity

    Args:
        api_key: api key
        workspace_id: the workspace_id
        template_name: the name of the template
        kwargs (_dict_): other keyword arguments to create db_
    """
    db_name = make_db_name(template_name)

    # FIXME remove these
    db_name = "new_structure_template_0_db_c155"

    return db_name


# FIXME remove these
USER = "_user_temp_2"


class CustomDict(dict):
    def values(self):
        new_values = [val + USER for val in super().values()]
        return new_values

    def __getitem__(self, key):
        val = super().__getitem__(key)
        if val:
            return val + USER
        return val

    def __or__(self, other):
        result = CustomDict(super().__or__(other))
        return result


class DatacubeConnection:

    def __init__(
        self, api_key: str, workspace_id: str, database: str = None, template_id: str = None
    ) -> None:
        """
        api_key (str): the API key
        workspace_id (str): workspace_id
        database (str): database name
        template_id (str): template_id
        """
        self.api_key = api_key
        self.workspace_id = workspace_id
        self.collection_names = self.normal_collection_names | self.metadata_collections
        self.template_id = None
        # FIXME if needed
        self.master_template_collection = (
            f"{self.workspace_id}_workflowai_master_template_collection"
        )

        if template_id is not None:
            self.master_template_data = self.check_db(template_id, database)
            self.template_id = template_id
            self.database = database
        else:
            self.database = database

    @property
    def metadata_collections(self):
        return CustomDict(
            {
                "document_metadata": f"{self.workspace_id}_workflowai_documents_metadata_collection_0",
                "clone_metadata": f"{self.workspace_id}_workflowai_clones_metadata_collection_0",
                "template_metadata": f"{self.workspace_id}_workflowai_templates_metadata_collection_0",
            }
        )

    @property
    def normal_collection_names(self):
        return CustomDict(
            {
                "workflow": f"{self.workspace_id}_workflowai_workflow_collection_0",
                "process": f"{self.workspace_id}_workflowai_process_collection",
                "document": f"{self.workspace_id}_workflowai_document_collection_0",
                "clone": f"{self.workspace_id}_workflowai_clone_collection_0",
                "template": f"{self.workspace_id}_workflowai_template_collection_0",
                "qrcode": f"{self.workspace_id}_workflowai_qrcode_collection_0",
                "link": f"{self.workspace_id}_workflowai_link_collection_0",
                "folder": f"{self.workspace_id}_workflowai_folder_collection_0",
            }
        )

    def check_db(self, template_id, database):
        filters = {"template_id": template_id, "template_database": database}
        template_data = self.get_templates_from_master_db(filters=filters, single=True)["data"]

        if not template_data:
            raise NotFound("template with db not found")

        return template_data[0]

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
            payload_dict["data"] = data
            payload = payload_dict
            payload.update({"records": [{"record": "1", "type": "overall"}]})

            # NOTE None is the default but if this is set to True that means it is
            # a new template insertion. Advised this is the only scenario where
            # this should be set to True
            if not kwargs.get("no_template_id"):

                # ensure template_id is present at time of insertion
                if not self.template_id:
                    raise ValueError("template_id is missing")

                # add the template_id for db reference
                payload["template_id"] = self.template_id
                payload["template_database"] = self.database
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
        collection = self.collection_names["workflow"]
        return self.post_data_to_collection(
            collection=collection, data=data, operation="insert", **kwargs
        )

    def update_workflow_collection(self, workflow_id: str, data: dict, **kwargs):
        query = {"_id": workflow_id}
        collection = self.collection_names["workflow"]
        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

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
        collection = self.collection_names["workflow"]
        limit = None if single is None else 1 if single else None

        if filters is None:
            filters = {}

        if limit is not None:
            return self.get_data_from_collection(collection, filters, limit=limit, **kwargs)
        else:
            return self.get_data_from_collection(collection, filters, **kwargs)

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
        if kwargs.get("metadata") == True:
            collection = self.collection_names["process_metadata"]
        else:
            collection = self.collection_names["process"]

        return self.post_data_to_collection(collection, data, "insert", **kwargs)

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

    def save_template_to_master_db(self, data: dict, **kwargs):
        database = get_master_db(self.workspace_id)
        return self.post_data_to_collection(
            self.master_template_collection, data, "insert", database=database, **kwargs
        )

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
        return self.save_to_template_collection(*args, metadata=True, **kwargs)

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

    def save_to_links_collection(self, data: dict, **kwargs):
        collection = self.collection_names["link"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)

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

    def cloning_document(self, document_id, auth_viewers, parent_id, process_id, **kwargs):
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
