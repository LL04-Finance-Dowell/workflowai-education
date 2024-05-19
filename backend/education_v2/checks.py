from datetime import datetime, UTC, timedelta
from education_v2.datacube_connection import DatacubeConnection

def is_finalized(item_id, item_type, dc_connect: DatacubeConnection, **kwargs):
    if item_type == "document":
        document = dc_connect.get_documents_from_collection({"_id": item_id}, single=True, **kwargs)["data"]
        
        if not document:
            return False, None
        
        doc_state = document[0]["document_state"]
        if doc_state == "finalized":
            return True, doc_state
        if doc_state == "rejected":
            return True, doc_state
        
    if item_type == "clone":
        document = dc_connect.get_clones_from_collection({"_id": item_id}, single=True, **kwargs)["data"]
        
        if not document:
            return False, None
        
        doc_state = document[0]["document_state"]
        if doc_state == "finalized":
            return True, doc_state
        if doc_state == "rejected":
            return True, doc_state
    
    if item_type == "template":
        template = dc_connect.get_templates_from_collection({"_id": item_id}, single=True, **kwargs)["data"]

        if not template:
            return False, None
        
        temp_state = template[0]["template_state"]
        if temp_state == "saved":
            return True, temp_state
        elif temp_state == "rejected":
            return True, temp_state
        elif temp_state == "draft":
            return False, "draft"
    
    return False, "processing"

def register_single_user_access(step, authorized_role, user):
    if step["stepRole"] == authorized_role:
        for clone_map in step["stepDocumentCloneMap"]:
            if user in clone_map:
                clone_map["accessed"] = True
                continue


def display_right(display):
    display_allowed = {
        "before_this_step": True,
        "after_this_step": False,
        "in_all_steps": True,
        "only_this_step": True,
    }
    return display_allowed.get(display)


def location_right(
    location, continent, my_continent, country, my_country, city, my_city
):
    if location == "any":
        return True
    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            return True
    return True


def time_limit_right(time, select_time_limits, start_time, end_time, creation_time):
    current_time = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M")
    current_time_object = datetime.strptime(current_time, "%Y-%m-%dT%H:%M") 
    if time == "no_time_limit":
        return True
    elif time == "select":
        creation_time_object = datetime.strptime(
            creation_time, "%d:%m:%Y,%H:%M:%S"
        ) 
        created_at = creation_time_object.strftime("%Y-%m-%dT%H:%M")
        if select_time_limits == "within_1_hour":
            time_limit = creation_time_object + timedelta(hours=1)
            return current_time_object <= time_limit
        elif select_time_limits == "within_8_hours":
            time_limit = creation_time_object + timedelta(hours=8)
            return current_time_object <= time_limit
        elif select_time_limits == "within_24_hours":
            time_limit = creation_time_object + timedelta(hours=24)
            return current_time_object <= time_limit
        elif select_time_limits == "within_3_days":
            time_limit = creation_time_object + timedelta(hours=72)
            return current_time_object <= time_limit
        elif select_time_limits == "within_7_days":
            time_limit = creation_time_object + timedelta(hours=168)
            return current_time_object <= time_limit
    elif time == "custom":
        if start_time and end_time:
            start_time_object = datetime.strptime(start_time, "%Y-%m-%dT%H:%M")
            end_time_object = datetime.strptime(end_time, "%Y-%m-%dT%H:%M")
            time_limit = end_time_object - start_time_object
            select_time_limits = f"within {time_limit.total_seconds() // 3600} hours"
            return (
                start_time_object <= end_time_object
                and current_time_object <= end_time_object
            )
        else:
            return False

