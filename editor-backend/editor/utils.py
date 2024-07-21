from datetime import datetime
import json
from editor.datacube_connection import DatacubeConnection
import requests


class InvalidTokenException(Exception):
    pass

def targeted_population(database, collection, fields, period):
    url = "https://100032.pythonanywhere.com/api/targeted_population/"
    database_details = {
        "database_name": "mongodb",
        "collection": collection,
        "database": database,
        "fields": fields,
    }
    number_of_variables = -1

    time_input = {
        "column_name": "Date",
        "split": "week",
        "period": period,
        "start_point": "2021/01/08",
        "end_point": "2021/01/25",
    }

    stage_input_list = []

    distribution_input = {"normal": 1, "poisson": 0, "binomial": 0, "bernoulli": 0}
    request_data = {
        "database_details": database_details,
        "distribution_input": distribution_input,
        "number_of_variable": number_of_variables,
        "stages": stage_input_list,
        "time_input": time_input,
    }

    headers = {"content-type": "application/json"}

    response = requests.post(url, json=request_data, headers=headers)

    return response.json()


def get_event_id():
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")
    url = "https://100003.pythonanywhere.com/event_creation"

    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41",
        "login_id": "lav",
        "session_id": "new",
        "processcode": "1",
        "regional_time": time,
        "dowell_time": time,
        "location": "22446576",
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
        "data_type": "learn",
        "purpose_of_usage": "add",
        "colour": "color value",
        "hashtags": "hash tag alue",
        "mentions": "mentions value",
        "emojis": "emojis",
    }

    r = requests.post(url, json=data)
    return r.text


def filter_id(key, value, data):
    return next((entry for entry in data if entry[key] == value), {})


def dowellconnection(
    cluster,
    database,
    collection,
    document,
    team_member_ID,
    function_ID,
    command,
    field,
    update_field,
):
    url = "http://uxlivinglab.pythonanywhere.com"
    # searchstring="ObjectId"+"("+"'"+"6139bd4969b0c91866e40551"+"'"+")"
    payload = json.dumps(
        {
            "cluster": cluster,
            "database": database,
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_ID,
            "function_ID": function_ID,
            "command": command,
            "field": field,
            "update_field": update_field,
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, headers=headers, data=payload)
    res = json.loads(response.text)

    return res


DOCUMENT_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "DocumentReports",
    "documentreports",
    "11689044433",
    "ABCDE",
]

DOCUMENT_METADATA_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "DocumentMetaData",
    "DocumentMetaData",
    "1222001",
    "ABCDE",
]

TEMPLATE_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "TemplateReports",
    "templatereports",
    "22689044433",
    "ABCDE",
]


DOCUMENT_METADATA_LIST = [
    "Documents",
    "Documentation",
    "DocumentMetaData",
    "DocumentMetaData",
    "1222001",
    "ABCDE",
]
TEMPLATE_METADATA_LIST = [
    "Documents",
    "Documentation",
    "TemplateMetaData",
    "TemplateMetaData",
    "1223001",
    "ABCDE",
]

TEMPLATE_METADATA_CONNECTION_LIST=[
    "Documents",
    "bangalore",
    "Documentation",
    "TemplateMetaData",
    "TemplateMetaData",
    "1223001",
    "ABCDE",    
]



def post_to_data_service(data):

    url = "https://uxlivinglab.pythonanywhere.com/"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url=url, data=data, headers=headers)
    return json.loads(response.text)

# The Popular dowell connection
def get_data_from_data_service(
    cluster: str,
    platform: str,
    database: str,
    collection: str,
    document: str,
    team_member_ID: str,
    function_ID: str,
    command: str,
    field: dict,
):
    """Pass In DB info + look fields + DB query to get data"""
    payload = json.dumps(
        {
            "cluster": cluster,
            "platform": platform,
            "database": database,
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_ID,
            "function_ID": function_ID,
            "command": command,
            "field": field,
            "update_field": "nil",
        }
    )
    response = post_to_data_service(payload)
    res = json.loads(response)
    if res["data"] is not None:
        if len(res["data"]):
            return res["data"]
    return


def single_query_document_collection(options):
    documents = get_data_from_data_service(
        *DOCUMENT_CONNECTION_LIST, "find", field=options
    )
    return documents

def single_query_document_metadata_collection(options):
    documents = get_data_from_data_service(
        *DOCUMENT_METADATA_CONNECTION_LIST, "find", field=options
    )
    return documents


def single_query_template_collection(options):
    template = get_data_from_data_service(
        *TEMPLATE_CONNECTION_LIST,
        "find",
        field=options,
    )
    return template


def single_query_template_metadata_collection(options):
    template = get_data_from_data_service(
        *TEMPLATE_METADATA_CONNECTION_LIST,
        "find",
        field=options,
    )
    return template


def access_editor(item_id, item_type, dc_connect: DatacubeConnection):
    EDITOR_API = "https://100058.pythonanywhere.com/api/generate-editor-link/"

    team_member_id = (
        "11689044433"
        if item_type == "document"
        else "1212001"
        if item_type == "clone"
        else "22689044433"
    )
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        field = "document_name"
    elif item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        field = "template_name"
        
    if item_type == "document":
        item_name = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)["data"]
        if not item_name:
            item_name = {}
        else:
            item_name = item_name[0]

        meta_data = dc_connect.get_documents_metadata_from_collection({"collection_id": item_id}, single=True)["data"]
        if not meta_data:
            meta_data = {}
        else:
            meta_data = meta_data[0]
        
    elif item_type == "template":
        item_name = dc_connect.get_templates_from_collection({"_id": item_id}, single=True)["data"]
        if not item_name:
            item_name = {}
        else:
            item_name = item_name[0]

        meta_data = dc_connect.get_templates_metadata_from_collection({"collection_id": item_id}, single=True)["data"]
        if not meta_data:
            meta_data = {}
        else:
            meta_data = meta_data[0]

    name = item_name.get(field, "")
    metadata_id = meta_data.get("_id")
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
            "metadata_id": metadata_id,
            "action": "document"
            if item_type == "document"
            else "clone"
            if item_type == "clone"
            else "template",
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
    
def check_item_version(*, action:str, field:dict, update_field:dict, dc_connect: DatacubeConnection)->bool:
    filters = {"_id":field["_id"]}
    if action == "document":
        item = dc_connect.get_documents_from_collection(filters=filters, single=True)["data"]
        if not item:
            item = {}
        else:
            item = item[0]

    elif action == "template":
        item = dc_connect.get_templates_from_collection(filters=filters, single=True)["data"]
        if not item:
            item = {}
        else:
            item = item[0]

    version = update_field.get("version")
    if version:
        existing_version = item.get("version")
        if not existing_version:
            existing_version = 0
        if (int(existing_version) + 1) != int(version):
            return False
        else:
            return True
    else:
        return False
    

def authorization_check(api_key):
    """
    Checks the validity of the API key.

    :param api_key: The API key to be validated.
    :return: The extracted token if the API key is valid.
    :raises InvalidTokenException: If the API key is missing, invalid, or has an incorrect format.
    """
    if not api_key or not api_key.startswith("Bearer "):

        raise InvalidTokenException("Bearer token is missing or invalid")
    try:
        _, token = api_key.split(" ")
    except ValueError:
        raise InvalidTokenException("Invalid Authorization header format")

    return token