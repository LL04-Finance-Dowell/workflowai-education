# helper functions
from rest_framework.response import Response

from app import processing


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
