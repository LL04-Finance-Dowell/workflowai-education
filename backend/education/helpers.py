# helper functions
import json
from datetime import UTC, datetime
from urllib.parse import quote_plus, unquote_plus

import bson
import requests
from cryptography.fernet import Fernet
from rest_framework.exceptions import APIException
from rest_framework.response import Response

from app import processing
from app.constants import MASTERLINK_URL, PUBLIC_LOGIN_API
from app.models import ProcessReminder


class InvalidTokenException(Exception):
    pass


class CustomAPIException(APIException):
    def __init__(self, detail=None, status_code=None):
        if detail is not None:
            self.detail = detail
        if status_code is not None:
            self.status_code = status_code


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

    return Response(response_data, status=status_code) if status_code else Response(response_data)


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


def check_all_accessed(dic):
    return all([item.get("accessed") for item in dic])


def check_progress(process, *args, **kwargs):
    steps = process["process_steps"]
    steps_count = len(steps)
    accessed = 0
    for step in steps:
        step_clone_map = step.get("stepDocumentCloneMap", [])
        if step_clone_map:
            if check_all_accessed(step_clone_map):
                accessed += 1

    percentage_progress = round((accessed / steps_count * 100), 2)
    return percentage_progress


def register_finalized(link_id):
    response = requests.put(
        f"{MASTERLINK_URL}?link_id={link_id}",
        data=json.dumps({"is_finalized": True}),
        headers={"Content-Type": "application/json"},
    )
    return


def check_last_finalizer(user, user_type, process) -> bool:
    steps = process["process_steps"]
    non_skipped_steps = []

    for step in steps:
        if step.get("skipStep") == False:
            non_skipped_steps.append(step)

    last_step = non_skipped_steps[len(non_skipped_steps) - 1]
    step_clone_map = last_step.get("stepDocumentCloneMap", [])

    if user_type == "team":
        for data in last_step["stepTeamMembers"]:
            if data.get("member") == user:
                if check_all_accessed(step_clone_map):
                    return True

    elif user_type == "user":
        for data in last_step["stepUserMembers"]:
            if data.get("member") == user:
                if check_all_accessed(step_clone_map):
                    return True

    elif user_type == "public":
        for data in last_step["stepPublicMembers"]:
            if data.get("member") == user:
                if check_all_accessed(step_clone_map):
                    return True
    else:
        return False


def dowell_email_sender(name, email, subject, email_content):
    email_url = "https://100085.pythonanywhere.com/api/uxlivinglab/email/"
    payload = {
        "toname": name,
        "toemail": email,
        "fromname": "Workflow AI",
        "fromemail": "workflowai@dowellresearch.sg",
        "subject": subject,
        "email_content": email_content,
    }

    requests.post(email_url, data=payload)


def remove_finalized_reminder(user, process_id):
    try:
        reminder = ProcessReminder.objects.get(step_finalizer=user, process_id=process_id)
        reminder.delete()
        return True
    except Exception as e:
        return False


def update_signed(signers_list: list, member: str, status: bool) -> list:
    if signers_list:
        for elem in signers_list:
            for key, val in elem.items():
                if key == member:
                    elem[key] = status
        return signers_list
    else:
        return [{member: status}]


def check_all_accessed(dic):
    return all([item.get("accessed") for item in dic])


def get_prev_and_next_users(
    process: dict, auth_user: str, auth_role: str, user_type: str
) -> tuple:
    """Gets the previous step signers and potential next step signers
        for specific process step

    Args:
        process (dict): A process dictionary
        auth_user (str):  Username of the user in question
        auth_role (str):  Role of the user in question

    Returns:
        tuple: (previous, next)
    """
    process_steps = process["process_steps"]
    prev_step = None
    next_step = None
    prev_viewers = None
    next_viewers = None

    if user_type == "public":
        auth_user = auth_user[0]
    else:
        auth_user = auth_user

    for current_idx, step in enumerate(process["process_steps"]):
        if step.get("stepRole") == auth_role:
            for item in step["stepDocumentCloneMap"]:
                if item.get(auth_user):
                    current_doc_id = item.get(auth_user)
                    # Check previous step get it's users
                    if current_idx > 0:
                        prev_step = process["process_steps"][current_idx - 1]
                        prev_viewers_doc_map = prev_step["stepDocumentCloneMap"]
                        prev_viewers = [
                            k
                            for item in prev_viewers_doc_map
                            for k, v in item.items()
                            if v == current_doc_id
                        ]

                    if current_idx < len(process_steps) - 1:
                        next_step = process["process_steps"][current_idx + 1]
                        next_viewers_team_doc_map = next_step["stepTeamMembers"]
                        next_viewers_user_doc_map = next_step["stepUserMembers"]
                        next_viewers_public_doc_map = next_step["stepPublicMembers"]
                        next_viewers = [
                            item.get("member")
                            for doc_map in [
                                next_viewers_team_doc_map,
                                next_viewers_user_doc_map,
                                next_viewers_public_doc_map,
                            ]
                            for item in doc_map
                        ]

    return (prev_viewers, next_viewers)


def paginate(dataset, page, limit):
    if dataset is not None:
        elements_to_return = page * limit
        if elements_to_return > len(dataset):
            return dataset[:][::-1]
        else:
            return dataset[:elements_to_return][::-1]
    return []


def remove_members_from_steps(data):
    for step in data.get("process_steps", []):
        step["stepPublicMembers"] = []
        step["stepTeamMembers"] = []
        step["stepUserMembers"] = []
        step["stepDocumentCloneMap"] = []


def validate_id(id):
    try:
        if bson.objectid.ObjectId.is_valid(id):
            return True
        else:
            return None
    except:
        return None


def register_public_login(qrid, org_name):
    res = requests.post(
        url=PUBLIC_LOGIN_API,
        data=json.dumps(
            {
                "qrid": qrid,
                "org_name": org_name,
                "product": "Workflow AI",
            }
        ),
        headers={"Content-Type": "application/json"},
    )
    if res.status_code == 200:
        return True
    return


def create_reminder(process_id, interval, members, created_by):
    try:
        for member in members:
            member_name = member.get("member")
            member_email = member.get("email")
            current_datetime = datetime.now(UTC).strftime("%d:%m:%Y,%H:%M:%S")

            if member_name and member_email:
                ProcessReminder.objects.create(
                    process_id=process_id,
                    step_finalizer=member_name,
                    email=member_email,
                    interval=interval,
                    last_reminder_datetime=current_datetime,
                    created_by=created_by,
                )
    except Exception:
        return


def set_reminder(reminder, step, process_id, created_by):
    try:
        team = step.get("stepTeamMembers", [])
        user = step.get("stepUserMembers", [])

        if reminder == "every_hour":
            if team:
                create_reminder(process_id, 60, team, created_by)
            if user:
                create_reminder(process_id, 60, user, created_by)

        elif reminder == "every_day":
            if team:
                create_reminder(process_id, 1440, team, created_by)
            if user:
                create_reminder(process_id, 1440, user, created_by)
    except Exception:
        return


def upload_image_to_interserver(img, img_name=None):
    url = "https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-qrcode-to-drive/"
    files = {"file": (img_name, img)}
    response = requests.post(url, files=files)

    try:
        json_data = response.json()
        file_url = json_data.get("file_url")
        return file_url
    except json.JSONDecodeError as e:
        # Handle JSON decoding error
        print("Error decoding JSON response:", e)
    except KeyError as e:
        # Handle missing "file_url" key error
        print("Error accessing 'file_url' key:", e)


def encrypt_credentials(api_key, workspace_id):
    credentials = f"{api_key}:{workspace_id}"
    try:
        with open("secret.key", "rb") as key_file:
            key = key_file.read()

        cipher_suite = Fernet(key)
        token = cipher_suite.encrypt(credentials.encode())
        return quote_plus(token)
    except:
        return None


def decrypt_credentials(token):
    try:
        with open("secret.key", "rb") as key_file:
            key = key_file.read()
        cipher_suite = Fernet(key)
        credentials = cipher_suite.decrypt(unquote_plus(token)).decode()
        return credentials.split(":")
    except:
        raise CustomAPIException("Unable to validate token", 422)
