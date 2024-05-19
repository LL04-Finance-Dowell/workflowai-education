import json
import re
from datetime import UTC, datetime

import requests

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


def create_db(options):
    """Creates a new database entity

    Args:
        options (_type_): _description_
    """


class DatacubeConnection:

    @property
    def collection_names(self):
        return {
            "workflow": f"{self.workspace_id}_workflow_collection_0",
            "process": f"{self.workspace_id}_process_collection",
            "document": f"{self.workspace_id}_document_collection_0",
            "document_metadata": f"{self.workspace_id}_documents_metadata_collection_0",
            "clone": f"{self.workspace_id}_clone_collection_0",
            "clone_metadata": f"{self.workspace_id}_clones_metadata_collection_0",
            "template": f"{self.workspace_id}_template_collection_0",
            "template_metadata": f"{self.workspace_id}_templates_metadata_collection_0",
            "qrcode": f"{self.workspace_id}_document_collection_0",  # TODO Change,
            "link": f"{self.workspace_id}_document_collection_0",
            "folder": f"{self.workspace_id}_folder_collection_0",
        }

    def __init__(self, api_key: str, workspace_id: str, database: str = None) -> None:
        """
        api_key (str): the API key
        workspace_id (str): workspace_id
        database (str): database name
        """
        self.api_key = api_key
        self.workspace_id = workspace_id
        self.database = database

    def add_collection_to_database(self, collections: str, num_of_collections=1, **kwargs):
        """adds collection(s) to a database

        Args:
            collections (str): comma separated list of collection names to be created
            num_of_collections (int): number of collcctions to be added
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
        self, collection: str, filters: dict = {}, limit=5, offset=0, **kwargs
    ):
        """_summary_

        Args:
            collection (str): collection name
            filters (dict): a dictionary of all the filter parameters
            limit (int, optional): max number of results per page. Defaults to 5.
            offset (int, optional): page number . Defaults to 0.
        """
        url = f"{DB_API}/get_data/"
        database: str = kwargs.get("database", self.database)

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
        }
        if operation.lower() == "insert":
            payload_dict["data"] = data
            payload = payload_dict
        elif operation.lower() == "update":
            payload_dict["update_data"] = data
            payload_dict["query"] = query
            payload = payload_dict
            response = requests.put(DB_API_CRUD, json=payload)
            return response
        elif operation.lower() == "delete":
            payload_dict["query"] = query
            payload = payload_dict
            response = requests.delete(DB_API_CRUD, json=payload)
            return
        # print(payload)
        response = requests.post(DB_API_CRUD, json=payload)
        res = json.loads(response.text)
        # print(res)
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

    def save_to_workflow_collection(self, collection_id: str, data: dict, **kwargs):
        return self.post_data_to_collection(
            collection=collection_id, data=data, operation="insert", **kwargs
        )

    def get_workflows_from_collection(self, filters=None, single=False, **kwargs):
        """
        Retrieves workflows from the workflow collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
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

    def save_to_clone_collection(self, collection_id: str, data: dict, **kwargs):
        if kwargs.get("metadata") == True:
            collection = self.collection_names["document_metadata"]
        else:
            collection = self.collection_names["document"]
            
        return self.post_data_to_collection(
            collection=collection_id, data=data, operation="insert", **kwargs
        )

    def save_to_clone_metadata_collection(self, data: dict, **kwargs):
        collection = self.collection_names["clone_metadata"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def get_clones_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves clones from the clone collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected clone(s) from the collection.
        """
        # TODO: confirm
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
        # TODO fix
        # collection = self.collection_names["qrcode"]
        collection = self.collection_names["document"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def get_qrcodes_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves qrcodes from the qrcode collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
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

    def update_process_collection(self, process_id: str, data: dict, query=None, **kwargs):
        query = {"_id": process_id}
        collection = self.collection_names["process"]
        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def get_processes_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves process from the process collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
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

    def update_document_collection(self, document_id: str, data: dict, **kwargs):
        query = {"_id": document_id}
        collection = self.collection_names["document"]
        return self.post_data_to_collection(collection, data, "update", query, **kwargs)

    def get_documents_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves documents from the document collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
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

    def get_templates_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves templates from the template collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
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
        
    def get_templates_metadata_from_collection(self, *args, **kwargs):
        """
        Retrieves template metadata from the template collection
        \n This method is a wrapper for `get_templates_from_collection` that ensures metadata 
        is retrieved for the templates.
        """
        return self.get_templates_from_collection(*args, metadata=True, **kwargs)

    def save_to_links_collection(self, data: dict, **kwargs):
        # TODO fix here
        # collection = self.collection_names["link"]
        collection = self.collection_names["document"]
        return self.post_data_to_collection(collection, data, "insert", **kwargs)

    def get_links_from_collection(self, filters: dict, single=False, **kwargs):
        """
        Retrieves links from the link collection.

        Args:
            filters (dict): _description.
            single (bool, optional): Determines the number of results to return.
            If True, returns only one result. If False, returns the max default limit. Defaults to False.
            **kwargs: Additional keyword arguments to be passed to the `get_data_from_collection` method.

        Returns:
            The selected link(s) from the collection.
        """
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
            single (bool, optional): Determines the number of results to return.
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

    def authorize(self, document_id, viewers, process_id, item_type, workspace_id=None, **kwargs):
        clone_collection = self.collection_names["clone"]
        clone_metadata_collection = self.collection_names["clone_metadata"]
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
                query = {"_id": document_id}
                metadata_clone_res = self.post_data_to_collection(
                    clone_metadata_collection, metadata_payload, "update", query, **kwargs
                )
            clone_res = self.post_data_to_collection(
                clone_collection, metadata_payload, "update", query, **kwargs
            )

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

    def access_editor(
        self,
        item_id,
        item_type,
        username="",
        portfolio="",
        email="",
    ):
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

        if item_type == "document":
            # item_name = self.get_documents_from_collection({"_id": item_id}, single=True)
            item_name = self.get_templates_from_collection({"_id": item_id}, single=True)
        elif item_type == "clone":
            # item_name = self.get_clones_from_collection({"_id": item_id}, single=True)
            item_name = self.get_templates_from_collection({"_id": item_id}, single=True)
        else:
            item_name = self.get_templates_from_collection({"_id": item_id}, single=True)

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
        clone_collection = self.collection_names["clone"]
        clone_metadata_collection = self.collection_names["clone_metadata"]
        try:
            viewers = []
            for m in auth_viewers:
                viewers.append(m["member"])

            document = self.get_documents_from_collection(
                filters={"_id": document_id},
                single=True,
            )
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
                collection_id=clone_collection,
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
                    }
                )

            return save_res["data"]["inserted_id"]
        except Exception as e:
            print(e)
            return
