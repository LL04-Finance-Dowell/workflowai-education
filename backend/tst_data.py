import json

import requests

DB_API = "https://datacube.uxlivinglab.online/db_api"
DB_API_CRUD = "https://datacube.uxlivinglab.online/db_api/crud/"

api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"
workspace_id = "6385c0f18eca0fb652c94558"
# databases = [
#     "new_structure_template_0_db_c155",
#     "new_structure_template_1_db_3f1c",
#     "new_structure_template_2_db_d8a4",
#     "6385c0f18eca0fb652c94558_master_db_0",
# ]


# def datacube_collection_retrieval(database: str):
#     """
#     Retrieve a list of collections in the DataCube database.

#     :param api_key: The API key for authentication.
#     :param db_name: The name of the database (Optional).
#     :return: The response text from the server.
#     """
#     url = "https://datacube.uxlivinglab.online/db_api/collections/"
#     payload = {"api_key": api_key, "db_name": database.lower(), "payment": False}
#     response = requests.get(url, json=payload)
#     res = json.loads(response.content)
#     return res


# def get_data_from_collection(collection: str, database: str):
#     """_summary_

#     Args:
#         collection (str): collection name
#         filters (dict): a dictionary of all the filter parameters
#         limit (int, optional): max number of results per page. Defaults to 5.
#         offset (int, optional): page number . Defaults to 0.
#     """
#     url = f"{DB_API}/get_data/"
#     payload = {
#         "api_key": api_key,
#         "db_name": database.lower(),
#         "coll_name": collection,
#         "operation": "fetch",
#         "filters": {},
#         "limit": 10,
#         "offset": 0,
#     }

#     response = requests.post(url, json=payload)
#     res = json.loads(response.text)
#     return res

# headers = {"Content-Type": "application/json"}


# def post_to_data_service(url: str, data: dict):
#     """posts data to an API endpoint

#     Args:
#         url (str): api endpoint
#         data (dict): data to post

#     Returns:
#         dict: json response
#     """
#     response = requests.post(url=url, data=data, headers=headers)
#     return json.loads(response.text)


# def add_collection_to_database(collections: str, num_of_collections=1, **kwargs):
#         """adds collection(s) to a database

#         Args:
#             collections (str): comma separated list of collection names to be created
#             num_of_collections (int): number of collections to be added
#         """

#         return response

# # for database in databases:
# #     collections = datacube_collection_retrieval(database)["data"][0]
# #     for coll in collections:
# #         data = get_data_from_collection(coll, database)["data"]
# #         if not data:
# #             continue
# #         # payload = {
# #         #     "api_key": api_key,
# #         #     "db_name": database.lower(),
# #         #     "coll_name": coll,
# #         #     "operation": "delete",
# #         #     "payment": False,
# #         #     "query": {"_id": data[0]["_id"]}
# #         # }
# #         # print(res)
# #         print(data)
# #         print(coll)
# #         print(database)

payload = {
    "api_key": api_key,
    "db_name": "first_template_test_db",
    "operation": "fetch",
    "payment": False,
    "coll_name": "6385c0f18eca0fb652c94558_workflowai_clone_collection",
    "query": {"_id": "6658eee2ccd83e66a9ebf482"}
}
res = requests.delete(DB_API_CRUD, json=payload)
print(res.text)


# import json

# import requests


# DB_API = "https://datacube.uxlivinglab.online/db_api"
# DB_API_CRUD = "https://datacube.uxlivinglab.online/db_api/crud/"

# headers = {"Content-Type": "application/json"}


# api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f"
# workspace_id = "6385c0f18eca0fb652c94558"
# databases = [
#     "new_structure_template_0_db_c155",
#     "new_structure_template_1_db_3f1c",
#     "new_structure_template_2_db_d8a4",
#     "6385c0f18eca0fb652c94558_master_db",
# ]

# # url = f"{DB_API}/add_collection/"
# # payload = json.dumps(
# #     {
# #         "api_key": api_key,
# #         "db_name": "new_structure_template_1_db_3f1c",
# #         "coll_names": "6385c0f18eca0fb652c94558_workflowai_master_qrcode_collection_test_1",
# #         "num_collections": 1,
# #     }
# # )
# # response = requests.post(url=url, data=payload, headers=headers)
# # print(json.loads(response.text))


# # class CustomDict(dict):
# #     def __init__(self, workspace_id, suffix, initial_dict: dict=None):
# #         super().__init__()
# #         self.workspace_id = workspace_id
# #         self.suffix = f"{suffix}"
# #         if initial_dict:
# #             for key, value in initial_dict.items():
# #                 self[key] = f"{self.workspace_id}_{value}_{self.suffix}"

# # # Usage example
# # workspace_id = '6385c0f18eca0fb652c94558'
# # initial_dict = {
# #     "document_metadata": "workflowai_documents_metadata_collection",
# #     "clone_metadata": "workflowai_clones_metadata_collection",
# #     "template_metadata": "workflowai_templates_metadata_collection",
# # }
# # no = {
# #                 "process": "workflowai_process_collection",
# #                 "document": "workflowai_document_collection",
# #                 "clone": "workflowai_clone_collection",
# #                 "template": "workflowai_template_collection",
# #                 "qrcode": "workflowai_qrcode_collection",
# #                 "link": "workflowai_link_collection",
# #                 "folder": "workflowai_folder_collection",
# #             }

# # needed_collections = CustomDict(workspace_id, "45hf", initial_dict | no)

# # print(needed_collections)


# url = f"{DB_API}/get_data/"
# payload = {
#     "api_key": api_key,
#     "db_name": databases[-1].lower(),
#     "coll_name": "6385c0f18eca0fb652c94558_workflowai_master_template_collection",
#     "operation": "fetch",
#     "filters": {},
#     "limit": 5,
#     "offset": 0,
# }

# response = requests.post(url, json=payload)
# res = json.loads(response.text)
# print(res)
