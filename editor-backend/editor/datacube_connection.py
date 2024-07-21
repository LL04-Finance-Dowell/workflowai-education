import json

import requests

DB_API = "https://datacube.uxlivinglab.online/db_api"
DB_API_CRUD = "https://datacube.uxlivinglab.online/db_api/crud/"

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


class DatacubeConnection:

    def __init__(
        self,
        api_key: str,
        workspace_id: str,
        database: str = None,
    ) -> None:
        """
        api_key (str): the API key
        workspace_id (str): workspace_id
        database (str): database name
        """
        self.api_key = api_key
        self.workspace_id = workspace_id
        self.collection_names = self.normal_collection_names | self.metadata_collections
        self.master_template_collection = self.master_collections["template"]
        self.workflow_db = f"{workspace_id}_workflowai_workflow_db"
        self.public_id_db = f"{workspace_id}_workflowai_public_id_db"
        self.master_links_db = f"{workspace_id}_workflowai_master_links_db"
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

    