import json
import requests

from education.constants import DB_API, DB_API_CRUD

headers = {"Content-Type": "application/json"}

def datacube_data_delete(collection_name, query):
    """
    Deletes documents from a collection in the datacube database.
    
    Args:
        api_key (str): API key for authentication.
        db_name (str): Name of the database.
        collection_name (str): Name of the collection.
        query (dict): Query to filter which documents to delete.
    
    Returns:
        str: Success or error message.
    """
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "delete",
        "query": query,
    }

    try:
        response = requests.delete(url, json=data)
        response.raise_for_status()
        return response.text
    
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    except requests.exceptions.RequestException as req_err:
        return f"Error occurred: {req_err}"

def datacube_data_update(collection_name, query, update_data):
    """
    Updates documents in a collection in the datacube database.
    
    Args:
        api_key (str): API key for authentication.
        db_name (str): Name of the database.
        coll_name (str): Name of the collection.
        query (dict): Query to filter documents to update.
        update_data (dict): Data to be updated.
    
    Returns:
        str: Success or error message.
    """
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "update",
        "query": query,
        "update_data": update_data,
    }

    try:
        response = requests.put(url, json=data)
        response.raise_for_status()
        return response.text
    
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    except requests.exceptions.RequestException as req_err:
        return f"Error occurred: {req_err}"

def datacube_data_insertion(collection_name, data):
    """
    Inserts new data into a collection in the datacube database.

    Args:
        api_key (str): API key for authentication.
        database_name (str): Name of the database.
        collection_name (str): Name of the collection.
        data (dict): Data to insert into the collection.
    
    Returns:
        str: Success or error message.
    """
    url = "https://datacube.uxlivinglab.online/db_api/crud/"
    payload = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data": data,
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.text
    
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    except requests.exceptions.RequestException as req_err:
        return f"Error occurred: {req_err}"

def datacube_data_retrieval(collection_name, data, limit, offset, payment):
    """
    Retrieves data from a collection in the datacube database with an additional payment field.
    
    Args:
        api_key (str): API key for authentication.
        database_name (str): Name of the database.
        collection_name (str): Name of the collection.
        data (dict): Filter parameters for the query.
        limit (int): Number of records to retrieve.
        offset (int): Starting point of the records to retrieve.
        payment (str): Payment information.
    
    Returns:
        str: Retrieved data or error message.
    """
    url = "https://datacube.uxlivinglab.online/db_api/get_data/"
    payload = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters": data,
        "limit": limit,
        "offset": offset,
        "payment": payment,
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.text
    
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    except requests.exceptions.RequestException as req_err:
        return f"Error occurred: {req_err}"

def datacube_collection_add(collection_name):
    """
    Adds a new collection to the specified database in Datacube.

    Args:
        api_key (str): API key for authentication.
        database_name (str): The name of the database to which the collection will be added.
        collection_name (str): The name of the new collection to add.

    Returns:
        dict/str: JSON response from the server on success or an error message.
    """
    url = "https://datacube.uxlivinglab.online/db_api/add_collection/"

    # Data to be sent with the POST request
    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_names": collection_name,
        "num_collections": 1,
    }

    try:
        # Make the POST request to add the collection
        response = requests.post(url, json=data)
        response.raise_for_status()  # Raises an error if the response status code is not 200-299
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    except requests.exceptions.RequestException as req_err:
        return f"Error occurred while contacting the datacube: {req_err}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

    # Attempt to parse the response text as JSON
    try:
        res = response.json()
        return res
    except json.JSONDecodeError:
        return f"Failed to decode response: {response.text}"

# Function to add a new database in Datacube
def datacube_db_add(name, payload):
    """
    Adds a new database in Datacube.
    
    Args:
        name (str): The name of the new database.
    
    Returns:
        str: Confirmation message or error.
    """
    # Simulating the process of adding a database
    try:
        # Add database logic here (e.g., API call or local logic)
        # Sending POST request
        response = requests.post(DATACUBE_API+'add_database/', json=payload, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            print("Database added successfully!")
            print("Response:", response.json())  # Assuming response is in JSON format
        else:
            print(f"Failed to add database. Status code: {response.status_code}")
            print("Error:", response.text)
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        
    except Exception as e:
        return f"Failed to add database '{name}': {e}"

# Function to add a template in Datacube
def datacube_template_add(name):
    """
    Adds a new template in Datacube.
    
    Args:
        name (str): The name of the new template.
    
    Returns:
        str: Confirmation message or error.
    """
    # Data payload for the request (replace with actual data as needed)
    payload = {
        "database_name": "my_database", #some dummy data for now
    }
    res = datacube_db_add(name)
    return f"Template '{name}' added. Result: {res}"

# Function to add a new document in a collection in Datacube
def datacube_document_add(name):
    """
    Adds a new document to a collection in Datacube.
    
    Args:
        name (str): The name of the document.
    
    Returns:
        str: Confirmation message or error.
    """
    try:
        res = datacube_collection_add(name)
        return f"Document '{name}' added successfully."
    except NameError:
        return f"Error: 'datacube_collection_add' is not defined."
    except Exception as e:
        return f"Failed to add document '{name}': {e}"

# Function to add a new workflow in Datacube
def datacube_workflow_add(name):
    """
    Adds a new workflow in Datacube.
    
    Args:
        name (str): The name of the workflow.
    
    Returns:
        str: Confirmation message or error.
    """
    try:
        res = datacube_collection_add(name)
        return f"Workflow '{name}' added successfully."
    except NameError:
        return f"Error: 'datacube_collection_add' is not defined."
    except Exception as e:
        return f"Failed to add workflow '{name}': {e}"

# Function to add a new process in Datacube
def datacube_add_process(name):
    """
    Adds a new workflow in Datacube.
    
    Args:
        name (str): The name of the workflow.
    
    Returns:
        str: Confirmation message or error.
    """
    try:
        res = datacube_collection_add(name)
        return f"Workflow '{name}' added successfully."
    except NameError:
        return f"Error: 'datacube_collection_add' is not defined."
    except Exception as e:
        return f"Failed to add workflow '{name}': {e}"


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


# def create_db(options):
#     """Creates a new database entity

#     Args:
#         options (_type_): _description_
#     """


# def add_collection_to_database(
#     api_key: str,
#     database: str,
#     collections: str,
#     num_of_collections=1,
# ):
#     """adds collection(s) to a database

#     Args:
#         api_key (str): API key
#         database (str): database name
#         collections (str): comma separated list of collection names to be created
#         num_of_collections (int): number of collcctions to be added
#     """
#     url = f"{DB_API}/add_collection/"

#     payload = json.dumps(
#         {
#             "api_key": api_key,
#             "db_name": database,
#             "coll_names": collections,
#             "num_collections": num_of_collections,
#         }
#     )

#     response = post_to_data_service(url=url, data=payload)
#     return response


# def get_data_from_collection(
#     api_key: str, database: str, collection: str, filters: dict = {}, limit=5, offset=0
# ):
#     """_summary_

#     Args:
#         api_key (str): the API key
#         database (str): database name
#         collection (str): collection name
#         filters (dict): a dictionary of all the filter parameters
#         limit (int, optional): max number of results per page. Defaults to 5.
#         offset (int, optional): page number . Defaults to 0.
#     """
#     url = f"{DB_API}/get_data/"

#     payload = {
#         "api_key": api_key,
#         "db_name": database,
#         "coll_name": collection,
#         "operation": "fetch",
#         "filters": filters,
#         "limit": limit,
#         "offset": offset,
#     }

#     response = requests.post(url, json=payload)
#     res = json.loads(response.text)
#     return res


# def post_data_to_collection(
#     api_key: str,
#     database: str,
#     collection: str,
#     data: dict,
#     operation: str,
#     query: dict = None,
# ):
#     payload_dict = {
#         "api_key": api_key,
#         "db_name": database,
#         "coll_name": collection,
#         "operation": operation,
#     }
#     if operation.lower() == "insert":
#         payload_dict["data"] = data
#         payload = payload_dict
#     elif operation.lower() == "update":
#         payload_dict["update_data"] = data
#         payload_dict["query"] = query
#         payload = payload_dict
#         response = requests.put(DB_API_CRUD, json=payload)
#         return response
#     elif operation.lower() == "delete":
#         payload_dict["query"] = query
#         payload = payload_dict
#         response = requests.delete(DB_API_CRUD, json=payload)
#         return
#     # print(payload)
#     response = requests.post(DB_API_CRUD, json=payload)
#     res = json.loads(response.text)
#     # print(res)
#     return res


# def datacube_collection_retrieval(api_key, db_name):
#     """
#     Retrieve a list of collections in the DataCube database.

#     :param api_key: The API key for authentication.
#     :param db_name: The name of the database.
#     :return: The response text from the server.
#     """
#     url = "https://datacube.uxlivinglab.online/db_api/collections/"
#     payload = {"api_key": api_key, "db_name": db_name, "payment": False}
#     response = requests.get(url, json=payload)
#     res = json.loads(response.content)
#     print("payload: ", payload)
#     return res


# def Template_database():
#     pass


# def save_to_metadata(api_key: str, collection_id: str, db_name: str, data: dict):
#     return post_data_to_collection(
#         api_key,
#         database=db_name,
#         collection=collection_id,
#         data=data,
#         operation="insert",
#     )


# def save_to_workflow_collection(
#     api_key: str, collection_id: str, db_name: str, data: dict
# ):
#     return post_data_to_collection(
#         api_key,
#         database=db_name,
#         collection=collection_id,
#         data=data,
#         operation="insert",
#     )


# def get_workflow_from_collection(
#     api_key: str,
#     database: str,
#     collection: str,
#     filters={},
# ):
#     return get_data_from_collection(api_key, database, collection, filters, limit=1)


# def save_to_process_collection(
#     api_key: str, database: str, collection: str, data: dict
# ):
#     return post_data_to_collection(api_key, database, collection, data, "insert")


# def update_process_collection(process_id: str, api_key: str, database: str, collection: str, data: dict):
#     query = {"_id": process_id}
#     return post_data_to_collection(
#         api_key, database, collection, data, "update", query
#     )


# def get_process_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters, limit=1)


# def save_to_document_collection(
#     api_key: str, database: str, collection: str, data: dict
# ):
#     return post_data_to_collection(api_key, database, collection, data, "insert")


# def get_clones_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters)


# def get_clone_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters, limit=1)


# def get_documents_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters)


# def get_document_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters, limit=1)


# def get_template_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters)

# def get_workflows_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters)


# def get_folders_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters)

# def get_folder_from_collection(
#     api_key: str, database: str, collection: str, filters: dict
# ):
#     return get_data_from_collection(api_key, database, collection, filters, limit=1)

# def save_to_folder_collection(
#     api_key: str, database: str, collection: str, data: dict
# ):
#     return post_data_to_collection(api_key, database, collection, data, "insert")
