# helper functions
from app import processing
from education.datacube_connection import (
    datacube_collection_retrieval,
    get_clone_from_collection,
    get_document_from_collection,
    get_template_from_collection,
)
from app.constants import EDITOR_API,DATACUBE_API
import json
from datetime import datetime
import requests

from rest_framework.response import Response
import re

import concurrent.futures


class InvalidTokenException(Exception):
    pass


def CustomResponse(success=True, message=None, response=None, status_code=None):
    """
    Create a custom response.
    :param success: Whether the operation was successful or not.
    :param message: Any message associated with the response.
    :param data: Data to be included in the response.
    :param status_code: HTTP status code for the response.
    :return: Response object.
    """
    response_data = {"success": success}
    if message is not None:
        response_data["message"] = message
    if response is not None:
        response_data["response"] = response

    return (
        Response(response_data, status=status_code)
        if status_code
        else Response(response_data)
    )


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


def generate_unique_collection_name(existing_collection_names, base_name):
    # Extract indices from existing names
    indices = [
        int(name.split("_")[-1])
        for name in existing_collection_names
        if name.startswith(base_name)
    ]
    # If no indices found, start from 1
    if not indices:
        return f"{base_name}_1"
    # Increment the highest index and generate the new name
    new_index = max(indices) + 1
    return f"{base_name}_{new_index}"


def check_if_name_exists_collection(api_key, collection_name, db_name):
    res = datacube_collection_retrieval(api_key, db_name)
    base_name = re.sub(r"_\d+$", "", collection_name)
    if res["success"]:
        # THIS SHOULD WORK AS WELL
        # if not [collection_name in item for item in res["data"][0]]:
        #     print("essssss: ", res["data"][0])
        #     new_collection_name = generate_unique_collection_name(res["data"][0], base_name)
        if collection_name not in res["data"][0]:
            new_collection_name = generate_unique_collection_name(
                res["data"][0], base_name
            )
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


def create_process_helper(
    company_id,
    workflows,
    created_by,
    creator_portfolio,
    process_type,
    org_name,
    workflows_ids,
    parent_id,
    data_type,
    process_title,
    action,
    email=None,
):
    processing.Process(
        company_id,
        workflows,
        created_by,
        creator_portfolio,
        process_type,
        org_name,
        workflows_ids,
        parent_id,
        data_type,
        process_title,
        action,
        email,
    )


def access_editor(
    item_id,
    item_type,
    api_key,
    database,
    collection_name,
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
        item_name = get_document_from_collection(
            api_key, database, collection_name, {"_id": item_id}
        )
    elif item_type == "clone":
        item_name = get_clone_from_collection(
            api_key, database, collection_name, {"_id": item_id}
        )
    else:
        item_name = get_template_from_collection(
            api_key, database, collection_name, {"_id": item_id}
        )

    name = item_name.get(field, "")
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
            "time": str(datetime.utcnow()),
            "command": "update",
            "update_field": {
                field: "",
                "content": "",
                "page": "",
                "edited_by": username,
                "portfolio": portfolio,
                "edited_on": str(datetime.utcnow()),
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


def send_mail(toname, toemail, subject, job_role, link):
    """
    Sends an email invitation for a job role through an API.

    Args:
        toname (str): The name of the recipient.
        toemail (str): The email address of the recipient.
        subject (str): The subject of the email.
        job_role (str): The job role the recipient is being invited to.
        link (str): A link with more information about the job.

    Returns:
        str: A success message if the request is successful, or an error message if it fails.
    """
    
    # API endpoint URL
    url = "https://100085.pythonanywhere.com/api/hr-invitation/"
    
    # Payload to be sent to the API
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "job_role": job_role,
        "link": link,
    }
    
    try:
        # Sending the POST request
        response = requests.post(url, json=payload)
        
        # Raise an exception if the request returned an unsuccessful status code (non 2xx/3xx)
        response.raise_for_status()

        # Return the response text if the request was successful
        return response.text
    
    except requests.exceptions.HTTPError as http_err:
        # Handles HTTP-specific errors
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    
    except requests.exceptions.ConnectionError as conn_err:
        # Handles connection-related errors
        return f"Connection error occurred: {conn_err}"

    except requests.exceptions.Timeout as timeout_err:
        # Handles request timeout errors
        return f"Timeout error occurred: {timeout_err}"

    except requests.exceptions.RequestException as req_err:
        # General exception for all request-related errors
        return f"An error occurred: {req_err}"

def interview_email(toname, toemail, subject, email_content):
    """
    Sends an interview email through an API.

    Args:
        toname (str): The name of the recipient.
        toemail (str): The email address of the recipient.
        subject (str): The subject of the email.
        email_content (str): The content/body of the email.

    Returns:
        str: A success message if the request is successful, or an error message if it fails.
    """
    
    # API endpoint URL
    url = "https://100085.pythonanywhere.com/api/email/"
    
    # Payload to be sent to the API
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "email_content": email_content,
    }

    try:
        # Sending the POST request
        response = requests.post(url, json=payload)
        
        # Raise an exception if the request returned an unsuccessful status code (non 2xx/3xx)
        response.raise_for_status()

        # Return success response text if the request was successful
        return response.text
    
    except requests.exceptions.HTTPError as http_err:
        # Handles HTTP-specific errors
        return f"HTTP error occurred: {http_err} - Status Code: {response.status_code}"
    
    except requests.exceptions.ConnectionError as conn_err:
        # Handles connection-related errors
        return f"Connection error occurred: {conn_err}"

    except requests.exceptions.Timeout as timeout_err:
        # Handles request timeout errors
        return f"Timeout error occurred: {timeout_err}"

    except requests.exceptions.RequestException as req_err:
        # General exception for all request-related errors
        return f"An error occurred: {req_err}"
