import ast
import json
import re

import requests
from app.constants import EDITOR_API, PROCESS_COMPLETION_MAIL
from django.core.cache import cache
from education.checks import is_finalized
from education.datacube_connection import DatacubeConnection, get_db
from education.datacube_processing import (DataCubeBackground,
                                           DataCubeHandleProcess,
                                           DataCubeProcess)
from education.helpers import (CustomResponse, InvalidTokenException,
                               authorization_check, check_all_accessed,
                               check_last_finalizer, check_progress,
                               dowell_email_sender, get_prev_and_next_users,
                               paginate, register_finalized,
                               remove_finalized_reminder,
                               remove_members_from_steps, update_signed,
                               validate_id)
from education.serializers import *
from education.serializers import CreateCollectionSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
# Education views are created here
# Anywhere we see template_function_it is


class HomeView(APIView):
    def get(self, request):
        return Response({"Message": "Education is live"}, status.HTTP_200_OK)


class DatabaseServices(APIView):
    def get(self, request):
        """
        Check the existence of the needed database and its collection.

        This method checks if all the needed databases are available for
        a given workspace. If a database is missing, it tries to create it.
        If collections are missing, they will be created.

        :param request: The HTTP request object.
        """
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.query_params.get("workspace_id")
        data_database = get_db(workspace_id)
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=data_database
        )

        needed_collections = list(dc_connect.collection_names.values())
        response_data = dc_connect.datacube_collection_retrieval()

        if not response_data["success"]:
            return CustomResponse(
                False,
                "Database is not yet available, kindly contact the administrator",
                None,
                status.HTTP_501_NOT_IMPLEMENTED,
            )

        ready_collections = response_data["data"][0] if response_data["data"] else []
        missing_collections = [coll for coll in needed_collections if coll not in ready_collections]

        for coll in missing_collections:
            res = dc_connect.add_collection_to_database(coll)
            if not res["success"]:
                return CustomResponse(
                    False,
                    f"Unable to create collection {coll}",
                    None,
                    status.HTTP_501_NOT_IMPLEMENTED,
                )

        return CustomResponse(True, "Databases are available to be used", None, status.HTTP_200_OK)



class NewTemplate(APIView):

    def get(self, request):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        template_id = request.GET.get("template_id")
        db_name = get_db(workspace_id)
        filters = {"_id": template_id}
        
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)
        res = dc_connect.get_templates_from_collection(filters, single=True)
        
        if res["success"]:
            return Response(res)
        return CustomResponse(False, res["message"], None, status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        type_request = request.GET.get("type")
        workspace_id = request.data.get("workspace_id")

        if type_request == "approve":
            return self.approve(request)

        if not validate_id(request.data["company_id"]):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        db_name = get_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

        portfolio = request.data.get("portfolio", "")
        viewers = [{"member": request.data["created_by"], "portfolio": portfolio}] if portfolio else []

        template_data = {
            "template_name": "Untitled Template",
            "content": "",
            "page": "",
            "folders": [],
            "created_by": request.data["created_by"],
            "company_id": request.data["company_id"],
            "data_type": request.data["data_type"],
            "template_type": "draft",
            "auth_viewers": viewers,
            "message": "",
            "approval": False,
            "collection_name": dc_connect.collection_names.get("template"),
            "DB_name": db_name,
        }

        res = dc_connect.save_to_template_collection(data=template_data)
        if res["success"]:
            collection_id = res["data"]["inserted_id"]
            metadata_db = get_db(workspace_id)
            metadata_collection = dc_connect.collection_names.get("template_metadata")

            res_metadata = dc_connect.save_to_template_metadata_collection(
                {
                    "template_name": "Untitled Template",
                    "created_by": request.data["created_by"],
                    "collection_id": collection_id,
                    "data_type": request.data["data_type"],
                    "company_id": request.data["company_id"],
                    "auth_viewers": viewers,
                    "template_state": "draft",
                    "approval": False,
                },
                database=metadata_db,
            )

            if not res_metadata["success"]:
                try:
                    dc_connect.add_collection_to_database(database=db_name, collections=metadata_collection)
                    return CustomResponse(True, "Collection created successfully", None, status.HTTP_201_CREATED)
                except:
                    return CustomResponse(
                        False,
                        "An error occurred while trying to save document metadata",
                        res_metadata["message"],
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            payload = {
                "product_name": "workflowai",
                "details": {
                    "_id": collection_id,
                    "field": "template_name",
                    "action": "template",
                    "metadata_id": res_metadata["data"]["inserted_id"],
                    "cluster": "Documents",
                    "database": db_name,
                    "collection": dc_connect.collection_names.get("template"),
                    "document": "templatereports",
                    "team_member_ID": "22689044433",
                    "function_ID": "ABCDE",
                    "command": "update",
                    "name": "Untitled Template",
                    "flag": "editing",
                    "update_field": {
                        "template_name": "Untitled Template",
                        "content": "",
                        "page": "",
                    },
                },
            }
            editor_link = requests.post(EDITOR_API, data=json.dumps(payload))

            return Response({
                "editor_link": editor_link.json(),
                "_id": res["data"]["inserted_id"],
            }, status.HTTP_201_CREATED)

        return Response({"Message": "Error creating template "}, status.HTTP_404_NOT_FOUND)

    def approve(self, request):
        form = request.data
        if not form:
            return Response("Data is needed", status.HTTP_400_BAD_REQUEST)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        database = get_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        update_data = {"approval": True}
        collection_id = form["collection_id"]
        metadata_id = form["metadata_id"]

        approval_update = dc_connect.update_template_collection(template_id=collection_id, data=update_data)
        metadata_approval_update = dc_connect.update_template_metadata_collection(metadata_id=metadata_id, data=update_data)

        if approval_update and metadata_approval_update:
            return CustomResponse(True, "Template approved", None, status.HTTP_200_OK)
        return CustomResponse(False, "Template approval failed", None, status.HTTP_400_BAD_REQUEST)


class ApprovedTemplates(APIView):

    def get(self, request, *args, **kwargs):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        database = get_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)
        
        filters = {"approval": True}
        res = dc_connect.get_templates_from_collection(filters)
        
        if res["success"]:
            return Response(res)
        return CustomResponse(False, res["message"], None, status.HTTP_400_BAD_REQUEST)



class Workflow(APIView):

    def get(self, request):
        """Get Workflows Created in a collection"""
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        db_name = get_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)
        
        res = dc_connect.get_workflows_from_collection(single=True)

        if res["success"]:
            return CustomResponse(True, "workflows found!", res["data"], status.HTTP_200_OK)
        return CustomResponse(False, "Couldn't fetch workflow collection", None, status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """Creates a new workflow"""
        form = request.data
        if not form:
            return Response("Workflow Data required", status.HTTP_400_BAD_REQUEST)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        db_name = get_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

        organization_id = form["company_id"]
        data = {
            "workflow_title": form["wf_title"],
            "steps": form["steps"],
        }

        res = dc_connect.save_to_workflow_collection({
            "workflows": data,
            "company_id": organization_id,
            "created_by": form["created_by"],
            "portfolio": form["portfolio"],
            "data_type": form["data_type"],
            "workflow_type": "original",
        })

        if res["success"]:
            return Response({
                "_id": res["data"]["inserted_id"],
                "workflows": data,
                "created_by": form["created_by"],
                "company_id": form["company_id"],
                "workflow_type": "original",
                "data_type": form["data_type"],
            }, status.HTTP_201_CREATED)
        return CustomResponse(False, "Workflow Not created", None, status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update an existing workflow"""
        form = request.data
        if not form:
            return CustomResponse(False, "Workflow Data is required", None, status.HTTP_400_BAD_REQUEST)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        workflow_id = form["workflow_id"]
        query = {"_id": workflow_id}
        database = get_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        collection = dc_connect.collection_names.get("workflow")
        update_data = form["workflow_update"]
        update_workflow = dc_connect.post_data_to_collection(collection, update_data, "update", query)

        if update_workflow:
            return CustomResponse(True, "Workflow updated successfully", None, status.HTTP_201_CREATED)
        return CustomResponse(False, update_workflow["message"], None, status.HTTP_400_BAD_REQUEST)


class CollectionData(APIView):

    def post(self, request):
        api_key = request.data["api_key"]
        database = request.data["db_name"]
        collection = request.data["coll_name"]
        filters = request.data["filters"]
        limit = request.data.get("limit")
        offset = request.data.get("offset")

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id="", database=database)
        res = dc_connect.get_data_from_collection(collection, filters, limit, offset)

        return Response(res, status.HTTP_200_OK)



class AddToCollection(APIView):
    def post(self, request):
        api_key = request.data["api_key"]
        database = request.data["db_name"]
        collection = request.data["coll_name"]
        filters = request.data["filters"]
        limit = request.data.get("limit")
        offset = request.data.get("offset")

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id="", database=database)

        res = dc_connect.get_data_from_collection(collection, filters, limit, offset)

        return Response(res, status.HTTP_200_OK)

class NewDocument(APIView):

    def post(self, request):
        workspace_id = request.data.get("workspace_id")
        organization_id = request.data.get("company_id")
        created_by = request.data.get("created_by")
        data_type = request.data.get("data_type")
        template_id = request.data.get("template_id")

        db_name_0 = get_db(workspace_id)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name_0)
        collection_name = dc_connect.collection_names.get("template")
        metadata_collection = dc_connect.collection_names.get("template_metadata")

        portfolio = request.data.get("portfolio", "")
        viewers = [{"member": created_by, "portfolio": portfolio}]

        if not workspace_id or not created_by or not data_type:
            return CustomResponse(
                False,
                "workspace_id, created_by and data_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        collection = dc_connect.check_if_name_exists_collection(collection_name)
        if not collection["success"]:
            return CustomResponse(False, "No collection found", None, status.HTTP_404_NOT_FOUND)

        template = dc_connect.get_templates_from_collection({"_id": template_id}, single=True)
        if not template["data"]:
            return CustomResponse(False, "No template found", None, status.HTTP_404_NOT_FOUND)

        if not template["data"][0]["approval"]:
            return CustomResponse(False, "Template is not approved", None, status.HTTP_403_FORBIDDEN)

        document_data = {
            "document_name": "Untitled Document",
            "content": template["data"][0].get("content"),
            "created_by": created_by,
            "company_id": organization_id,
            "page": template["data"][0]["page"],
            "data_type": data_type,
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "original",
            "collection_name": collection_name,
            "process_id": "",
            "folders": [],
            "template": db_name_0,
        }

        res = dc_connect.save_to_document_collection(document_data)

        if res["success"]:
            collection_id = res["data"]["inserted_id"]
            metadata = {
                "document_name": "Untitled Document",
                "created_by": created_by,
                "collection_id": collection_id,
                "data_type": data_type,
                "company_id": organization_id,
                "auth_viewers": viewers,
                "document_state": "draft",
            }

            res_metadata = dc_connect.save_to_document_metadata_collection(metadata)

            if not res_metadata["success"]:
                return CustomResponse(
                    False,
                    "An error occurred while trying to save document metadata",
                    None,
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            
            return CustomResponse(
                True,
                {"_id": res["data"]["inserted_id"], "doc_status": "document created"},
                None,
                status.HTTP_201_CREATED,
            )

        return CustomResponse(
            False,
            "An error occurred while trying to save document",
            None,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )



class Document(APIView):
    def get(self, request, company_id):
        """List of Created Documents."""
        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")
        document_type = request.query_params.get("document_type")
        document_state = request.query_params.get("document_state")
        member = request.query_params.get("member")
        portfolio = request.query_params.get("portfolio")

        db_name = get_db(workspace_id)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        # NOTE change this or find out why
        collection_name = dc_connect.collection_names.get("template")

        if not document_type or not document_state or not workspace_id:
            return CustomResponse(
                False,
                "document_type, workspace_id and document_state are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )
        if not validate_id(company_id) or not data_type:
            return CustomResponse(False, "Invalid Request!", None, status.HTTP_400_BAD_REQUEST)

        collection = dc_connect.check_if_name_exists_collection(collection_name)

        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        if member and portfolio:
            auth_viewers = [{"member": member, "portfolio": portfolio}]

            # NOTE compare
            document_list = dc_connect.get_clones_from_collection(
                {
                    "company_id": company_id,
                    "data_type": data_type,
                    "document_state": document_state,
                    "auth_viewers": auth_viewers,
                },
            )
            return Response(
                {"documents": document_list},
                status=status.HTTP_200_OK,
            )
        else:
            if document_type == "document":
                # NOTE compare
                documents = dc_connect.get_documents_from_collection(
                    {
                        "company_id": company_id,
                        "data_type": data_type,
                        "document_state": document_state,
                    },
                )
                return Response({"documents": documents}, status=status.HTTP_200_OK)
            if document_type == "clone":
                cache_key = f"clones_{workspace_id}"
                clones_list = cache.get(cache_key)
                if clones_list is None:
                    # NOTE compare
                    clones_list = dc_connect.get_clones_from_collection(
                        {
                            "company_id": company_id,
                            "data_type": data_type,
                            "document_state": document_state,
                        },
                    )
                    cache.set(cache_key, clones_list, timeout=60)
                return Response(
                    {"clones": clones_list},
                    status.HTTP_200_OK,
                )


class DocumentLink(APIView):
    def get(self, request, item_id):
        """editor link for a document"""
        workspace_id = request.query_params.get("workspace_id")
        document_type = request.query_params.get("document_type")
        portfolio = request.query_params.get("portfolio", "")
        db_name = get_db(workspace_id)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)
        collection_name = dc_connect.collection_names.get("template")

        if not document_type or not workspace_id:
            return CustomResponse(
                False,
                "workspace_id and document_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        collection = dc_connect.check_if_name_exists_collection(collection_name)
        if not collection["success"]:
            return CustomResponse(False, "No collection found", None, status.HTTP_404_NOT_FOUND)

        collection_name = collection["name"]

        if not validate_id(item_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        document = None
        if document_type == "document":
            document = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)
        elif document_type == "clone":
            document = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)

        if document:
            editor_link = dc_connect.access_editor(item_id, document_type, portfolio=portfolio)
            if not editor_link:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(editor_link, status.HTTP_200_OK)

        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)


class DocumentDetail(APIView):
    def get(self, request, item_id):
        """Retrieves the document object for a specific document"""
        workspace_id = request.query_params.get("workspace_id")
        document_type = request.query_params.get("document_type")

        db_name = get_db(workspace_id)
        collection_name = f"{workspace_id}_template_collection_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        if not workspace_id or not document_type:
            return CustomResponse(
                False,
                "workspace_id and document_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        collection = dc_connect.check_if_name_exists_collection(collection_name)

        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        collection_name = collection["name"]

        if not validate_id(item_id) or not document_type:
            return CustomResponse(
                False, "Something went wrong!", None, status.HTTP_400_BAD_REQUEST
            )

        if document_type == "document":
            document = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)
            return Response(document["data"], status.HTTP_200_OK)

        if document_type == "clone":
            document = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)
            return Response(document["data"], status.HTTP_200_OK)

        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)

class ItemContent(APIView):
    def get(self, request, item_id):
        """Content map of a given document, template, or clone"""
        content = []
        item_type = request.query_params.get("item_type")
        workspace_id = request.query_params.get("workspace_id")
        db_name = get_db(workspace_id)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

        if not validate_id(item_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        if item_type == "template":
            item_content = dc_connect.get_templates_from_collection({"_id": item_id}, single=True)
        else:
            item_content = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)

        if not item_content["data"]:
            return CustomResponse(False, "Content not found", None, status.HTTP_404_NOT_FOUND)

        try:
            my_dict = ast.literal_eval(item_content["data"][0]["content"])[0][0]
        except (KeyError, IndexError, ValueError):
            return CustomResponse(False, "Invalid content format", None, status.HTTP_400_BAD_REQUEST)

        content = self.parse_content(my_dict)
        sorted_content = self.sort_content(content)
        return Response(sorted_content, status.HTTP_200_OK)

    def parse_content(self, my_dict):
        """Parse the content from the item dictionary"""
        content = []
        all_keys = my_dict.keys()
        for key in all_keys:
            temp_list = []
            for item in my_dict[key]:
                if "data" in item:
                    if item["type"] == "CONTAINER_INPUT":
                        container_list = [{"id": sub_item["id"], "data": sub_item["data"]} for sub_item in item["data"]]
                        temp_list.append({"id": item["id"], "data": container_list})
                    else:
                        temp_list.append({"id": item["id"], "data": item["data"]})
                else:
                    temp_list.append({"id": item["id"], "data": ""})
            content.append({key: temp_list})
        return content

    def sort_content(self, content):
        """Sort the parsed content based on numeric values in the IDs"""
        sorted_content = []
        for dicts in content:
            for key, val in dicts.items():
                sorted_content.append({
                    key: sorted(dicts[key], key=lambda x: int(re.findall(r"\d+", x["id"])[-1]))
                })
        return sorted_content



class FinalizeOrReject(APIView):
    def post(self, request, process_id, *args, **kwargs):
        """After access is granted and the user has made changes on a document."""

        if not validate_id(process_id):
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        request_data = kwargs.get("payload", request.data)
        if not request_data:
            return Response("You are missing something", status.HTTP_400_BAD_REQUEST)

        api_key = request.data.get("api_key")
        workspace_id = request.data.get("workspace_id")
        database = request.data.get("database")
        item_id = request_data.get("item_id")
        item_type = request_data.get("item_type")
        role = request_data.get("role")
        user = request_data.get("authorized")
        user_type = request_data.get("user_type")
        state = request_data.get("action")
        message = request_data.get("message", "")

        if not api_key or not workspace_id or not database or not item_id or not item_type or not role or not user or not user_type or not state:
            return Response("Missing required fields", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        if state == "rejected" and not message:
            return Response("Provide a reason for rejecting the document", status=status.HTTP_400_BAD_REQUEST)

        check, current_state = is_finalized(item_id, item_type, dc_connect)
        if self.is_already_processed(check, current_state, item_type):
            return Response(f"{item_type} already processed as `{current_state}`!", status.HTTP_200_OK)

        updated_signers_true = self.process_clone(dc_connect, item_type, item_id, user) if item_type == "clone" else None

        res = dc_connect.finalize_item(item_id, state, item_type, message, updated_signers_true)
        if res["success"]:
            if state == "rejected":
                return self.handle_rejection(dc_connect, process_id, item_id, item_type, message)
            else:
                return self.handle_finalization(dc_connect, request_data, process_id, item_id, item_type, role, user, user_type, message)
        return Response("An error occurred", status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, process_id):
        return Response("Success", status.HTTP_200_OK)

    def is_already_processed(self, check, current_state, item_type):
        if item_type == "document" or item_type == "clone":
            return check and current_state != "processing"
        elif item_type == "template":
            return check and current_state != "draft"
        return False

    def process_clone(self, dc_connect, item_type, item_id, user):
        if item_type == "clone":
            sl_data = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)["data"]
            signers_list = sl_data[0].get("signed_by") if sl_data else None
            return update_signed(signers_list, member=user, status=True)
        return None

    def handle_rejection(self, dc_connect, process_id, item_id, item_type, message):
        try:
            process = dc_connect.get_processes_from_collection({"_id": process_id}, single=True)["data"]
            process_steps = process[0].get("process_steps")
            process_data = {"process_steps": process_steps, "processing_state": "rejected"}
            dc_connect.update_process_collection(process_id, process_data)
            return Response("Document rejected successfully", status.HTTP_200_OK)
        except Exception as e:
            dc_connect.finalize_item(item_id, "processing", item_type, signers=None)
            process_data = {"process_steps": process_steps, "processing_state": "processing"}
            dc_connect.update_process_collection(process_id, process_data)
            return Response(f"An error occurred while rejecting the process: {e}", status.HTTP_500_INTERNAL_SERVER_ERROR)

    def handle_finalization(self, dc_connect, request_data, process_id, item_id, item_type, role, user, user_type, message):
        try:
            process = dc_connect.get_processes_from_collection({"_id": process_id}, single=True)["data"][0]
            background = DataCubeBackground(process, item_type, item_id, role, user, message)
            if user_type == "public":
                link_id = request_data.get("link_id")
                register_finalized(link_id)

            if item_type in ["document", "clone"]:
                return self.process_document(dc_connect, process, item_id, item_type, role, user, process_id)
            elif item_type == "template":
                return self.process_template(dc_connect, process, item_id, process_id, user)
        except Exception as err:
            print(err)
            return Response("An error occurred during processing", status.HTTP_500_INTERNAL_SERVER_ERROR)

    def process_document(self, dc_connect, process, item_id, item_type, role, user, process_id):
        background.document_processing()
        item = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)["data"]
        if item:
            item = item[0]
            meta_id = dc_connect.get_metadata_id(item_id, item_type)
            if item.get("document_state") == "finalized":
                self.handle_finalized_document(dc_connect, process, item_id, meta_id, item_type)
            elif item.get("document_state") == "processing":
                dc_connect.update_metadata(meta_id, "processing", item_type)

            if check_last_finalizer(user, user_type, process):
                self.send_completion_email(process)

            remove_finalized_reminder(user, process_id)
            return Response("Document processed successfully", status.HTTP_200_OK)

    def process_template(self, dc_connect, process, item_id, process_id, user):
        background.template_processing()
        item = dc_connect.get_templates_from_collection({"_id": item_id}, single=True)["data"]
        if item:
            item = item[0]
            meta_id = dc_connect.get_metadata_id(item_id, item_type)
            if item.get("template_state") == "saved":
                updated_signers_true = update_signed(signers_list, member=user, status=True)
                dc_connect.update_metadata(meta_id, "saved", item_type, signers=updated_signers_true)
            elif item.get("template_state") == "draft":
                dc_connect.update_metadata(meta_id, "draft", item_type)

            if check_last_finalizer(user, user_type, process):
                self.send_completion_email(process)

            remove_finalized_reminder(user, process_id)
            return Response("Template processed successfully", status.HTTP_200_OK)

    def handle_finalized_document(self, dc_connect, process, item_id, meta_id, item_type):
        updated_process = dc_connect.get_processes_from_collection({"_id": process_id}, single=True)["data"][0]
        process_state = updated_process.get("processing_state")
        if process.get("process_type") == "internal" and process_state == "finalized":
            process_creator = process.get("created_by")
            process_creator_portfolio = process.get("creator_portfolio")
            parent_process = process.get("parent_process")
            user_dict = {"member": process_creator, "portfolio": process_creator_portfolio}
            dc_connect.authorize(item_id, user_dict, parent_process, "document")
            dc_connect.authorize_metadata(meta_id, user_dict, parent_process, "document")
        else:
            dc_connect.update_metadata(meta_id, "finalized", item_type, signers=updated_signers_true)

    def send_completion_email(self, process):
        subject = f"Completion of {process['process_title']} Processing"
        email = process.get("email", None)
        if email:
            dowell_email_sender(process["created_by"], email, subject, email_content=PROCESS_COMPLETION_MAIL)


class FinalizeOrRejectEducation(APIView):
    def post(self, request, collection_id):
        """After access is granted and the user has made changes on a document."""
        if not validate_id(collection_id):
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        if not request.data:
            return Response("You are missing something", status.HTTP_400_BAD_REQUEST)

        api_key = request.data.get("api_key")
        collection_name = request.data.get("coll_name")
        workspace_id = request.data.get("workspace_id")
        item_id = request.data.get("item_id")
        item_type = request.data.get("item_type")
        role = request.data.get("role")
        user = request.data.get("authorized")
        user_type = request.data.get("user_type")
        state = request.data.get("action")
        message = request.data.get("message")
        link_id = request.data.get("link_id")
        product = request.data.get("product", "education")
        database = get_db(workspace_id)

        if not api_key or not collection_name or not workspace_id or not item_id or not item_type or not role or not user or not user_type or not state:
            return Response("Missing required fields", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        payload = {
            "item_id": item_id,
            "item_type": item_type,
            "role": role,
            "authorized": user,
            "user_type": user_type,
            "action": state,
            "message": message,
            "link_id": link_id,
        }

        query = {"_id": collection_id}
        data = dc_connect.get_data_from_collection(collection_name, filters=query, limit=1)
        if not data["data"]:
            return Response("Collection not found", status.HTTP_404_NOT_FOUND)

        process_id = data["data"][0].get("process", {}).get("_id")
        if not process_id:
            return Response("Process ID not found in the collection", status.HTTP_404_NOT_FOUND)

        res = FinalizeOrReject().post(request, process_id, payload=payload)

        if res.status_code != 200:
            return Response(res.data, status=res.status_code)

        process = dc_connect.get_processes_from_collection(database=database, filters={"_id": process_id})["data"]
        if not process:
            return CustomResponse(False, "Document could not be accessed!", None, status.HTTP_404_NOT_FOUND)

        dc_connect.update_process_collection(process_id=collection_id, data={"process": process[0]})

        return Response(res.data, status.HTTP_200_OK)


class Folders(APIView):
    def get(self, request):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        data_type = request.query_params.get("data_type")
        company_id = request.query_params.get("company_id")
        workspace_id = request.query_params.get("workspace_id")
        database = get_db(workspace_id)

        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=None, database=database)

        cache_key = f"folders_{company_id}"
        folders_list = cache.get(cache_key)
        if folders_list is None:
            try:
                folders_list = dc_connect.get_folders_from_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, folders_list, timeout=60)
            except Exception as e:
                return Response({"error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(folders_list, status.HTTP_200_OK)

    def post(self, request):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.query_params.get("workspace_id")
        folder_name = request.data.get("folder_name")
        created_by = request.data.get("created_by")
        company_id = request.data.get("company_id")
        data_type = request.data.get("data_type")
        database = get_db(workspace_id)

        if not all([folder_name, created_by, company_id, data_type]):
            return CustomResponse(False, "Invalid Request!", None, status.HTTP_400_BAD_REQUEST)

        if not validate_id(company_id):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=None, database=database)

        data = []
        res = dc_connect.save_to_folder_collection(
            {
                "folder_name": folder_name,
                "data": data,
                "created_by": created_by,
                "company_id": company_id,
                "data_type": data_type,
                "folder_type": "original",
            }
        )

        if res["success"]:
            return CustomResponse(True, res["data"]["inserted_id"], None, status.HTTP_201_CREATED)
        else:
            return CustomResponse(False, "Failed to save folder", None, status.HTTP_500_INTERNAL_SERVER_ERROR)


class FolderDetail(APIView):
    def get(self, request, folder_id):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(folder_id):
            return Response("Invalid folder ID!", status.HTTP_400_BAD_REQUEST)

        workspace_id = request.query_params.get("workspace_id")
        database = get_db(workspace_id)

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=None, database=database)

        try:
            folder_details = dc_connect.get_folders_from_collection({"_id": folder_id}, single=True)
        except Exception as e:
            return Response({"error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not folder_details["data"]:
            return Response("Folder not found!", status.HTTP_404_NOT_FOUND)

        return Response(folder_details["data"], status.HTTP_200_OK)

    # def put(self, request, folder_id):
    #     form = request.data
    #     if not form:
    #         return Response("Folder Data is Required", status.HTTP_400_BAD_REQUEST)
    #     items = form["items"]
    #     old_folder = get_folder_from_collection({"_id": folder_id})
    #     old_folder["folder_name"] = form["folder_name"]
    #     old_folder["data"].extend(items)
    #     document_ids = [item["document_id"] for item in items if "document_id" in item]
    #     template_ids = [item["template_id"] for item in items if "template_id" in item]
    #     if items:
    #         process_folders_to_item(document_ids, folder_id, add_document_to_folder)
    #         process_folders_to_item(template_ids, folder_id, add_template_to_folder)
    #     updt_folder = json.loads(update_folder(folder_id, old_folder))
    #     if updt_folder["isSuccess"]:
    #         return Response("Folder Updated", status.HTTP_201_CREATED)

    # def delete(self, request, folder_id):
    #     item_id = request.query_params.get("item_id")
    #     item_type = request.query_params.get("item_type")
    #     delete_items_in_folder(item_id, folder_id, item_type)
    #     return Response(status.HTTP_204_NO_CONTENT)


class DocumentOrTemplateProcessing(APIView):
    def post(self, request, *args, **kwargs):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.query_params.get("workspace_id")
        database = get_db(workspace_id)
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        payload_dict = kwargs.get("payload")
        if payload_dict:
            request_data = payload_dict
        else:
            request_data = request.data

        if not request_data:
            return Response("You are missing something!", status.HTTP_400_BAD_REQUEST)

        organization_id = request_data["company_id"]
        process = DataCubeProcess(
            request_data["workflows"],
            request_data["created_by"],
            request_data["creator_portfolio"],
            organization_id,
            request_data["process_type"],
            request_data["org_name"],
            request_data["workflows_ids"],
            request_data["parent_id"],
            request_data["data_type"],
            request_data["process_title"],
            request.data.get("email", None),
            dc_connect=dc_connect,
        )
        action = request_data["action"]
        data = None
        process_id = request_data.get("process_id")
        
        # Mapping actions to corresponding functions
        action_mapping = {
            "save_workflow_to_document_and_save_to_drafts": process.normal_process,
            "start_document_processing_content_wise": process.normal_process,
            "start_document_processing_wf_steps_wise": process.normal_process,
            "start_document_processing_wf_wise": process.normal_process,
            "test_document_processing_content_wise": process.test_process,
            "test_document_processing_wf_steps_wise": process.test_process,
            "test_document_processing_wf_wise": process.test_process,
            "close_processing_and_mark_as_completed": self.close_processing_and_mark_as_completed,
            "cancel_process_before_completion": self.cancel_process_before_completion,
            "pause_processing_after_completing_ongoing_step": self.pause_processing_after_completing_ongoing_step,
        }
        
        # Execute the action
        if action in action_mapping:
            try:
                data = action_mapping[action](process, process_id, dc_connect, request_data)
            except Exception as e:
                return Response({"error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)

        if data:
            verification_links = DataCubeHandleProcess(data, dc_connect=dc_connect).start()
            return Response(verification_links, status.HTTP_200_OK)
        return Response()

    def close_processing_and_mark_as_completed(self, process, process_id, dc_connect, request_data):
        process_data = dc_connect.get_processes_from_collection(filters={"_id": process_id}, single=True)["data"]
        if not process_data:
            return Response("Process not found!", status.HTTP_404_NOT_FOUND)
        
        process_data = process_data[0]
        if process_data["processing_state"] == "completed":
            return Response("This Workflow process is already complete", status.HTTP_200_OK)
        
        res = dc_connect.update_process_collection(
            process_id=process_data["process_id"],
            data={
                "process_steps": process_data["processing_steps"],
                "processing_state": "completed",
            },
        )
        if res["success"]:
            return Response("Process closed and marked as complete!", status.HTTP_200_OK)
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

    def cancel_process_before_completion(self, process, process_id, dc_connect, request_data):
        process_data = dc_connect.get_processes_from_collection(filters={"_id": process_id}, single=True)["data"]
        if not process_data:
            return Response("Process not found!", status.HTTP_404_NOT_FOUND)
        
        process_data = process_data[0]
        if process_data["processing_state"] == "cancelled":
            return Response("This Workflow process is Cancelled!", status.HTTP_200_OK)
        
        res = dc_connect.update_process_collection(
            process_id=process_data["process_id"],
            data={
                "process_steps": process_data["processing_steps"],
                "processing_state": "cancelled",
            },
        )
        if res["success"]:
            return Response("Process closed and marked as cancelled!", status.HTTP_200_OK)
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

    def pause_processing_after_completing_ongoing_step(self, process, process_id, dc_connect, request_data):
        return Response(
            "This Option is currently in development",
            status.HTTP_501_NOT_IMPLEMENTED,
        )

class Process(APIView):
    def get(self, request, company_id):
        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)

        db_name = get_db(workspace_id)
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )
        process_state = request.query_params.get("process_state")

        if process_state:
            completed_processes = dc_connect.get_processes_from_collection(
                filters={
                    "company_id": company_id,
                    "data_type": data_type,
                    "processing_state": process_state,
                }
            )
            page = int(request.GET.get("page", 1))
            data = paginate(completed_processes["data"], page, 50)
            completed_processes["data"] = data
            return Response(completed_processes, status.HTTP_200_OK)
        else:
            """By Company"""
            cache_key = f"processes_{company_id}"
            process_list = cache.get(cache_key)
            if process_list is None:
                process_list = dc_connect.get_processes_from_collection(
                    filters={"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, process_list, timeout=60)
            return Response(process_list, status.HTTP_200_OK)

class ProcessDetail(APIView):

    def get(self, request, process_id):
        """Get process by process id"""
        workspace_id = request.query_params.get("workspace_id")

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
            db_name = get_db(workspace_id)
            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            if not validate_id(process_id):
                return Response("Invalid process ID!", status.HTTP_400_BAD_REQUEST)

            process = dc_connect.get_processes_from_collection(filters={"_id": process_id}, single=True)["data"]

            if not process:
                return CustomResponse(False, "Process not found", status.HTTP_404_NOT_FOUND)

            progress = check_progress(process[0])
            parent_id = process[0]["parent_item_id"]

            if parent_id:
                document = dc_connect.get_documents_from_collection({"_id": parent_id}, single=True)["data"]
                if document:
                    document_name = document[0]["document_name"]
                    process[0].update({"document_name": document_name})

                links = dc_connect.get_links_from_collection(filters={"process_id": process[0]["_id"]})["data"]

                if links:
                    links_object = links[0]
                    process[0].update({"links": links_object["link"]})

            process[0]["progress"] = progress
            return Response(process[0], status.HTTP_200_OK)

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

    def put(self, request, process_id):
        """Update process details"""
        workspace_id = request.query_params.get("workspace_id")

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
            db_name = get_db(workspace_id)
            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            if not validate_id(process_id):
                return Response("Invalid process ID!", status.HTTP_400_BAD_REQUEST)

            if not request.data:
                return Response("Some parameters are missing", status.HTTP_400_BAD_REQUEST)

            workflow = request.data.get("workflows")
            step_id = request.data.get("step_id", 0) - 1

            process = dc_connect.get_processes_from_collection(filters={"_id": process_id}, single=True)
            data = process["data"]
            if not data:
                return CustomResponse(False, process["message"], None, status.HTTP_404_NOT_FOUND)

            steps = data[0].get("process_steps")
            state = "processing_state"
            step_content = steps[step_id]
            if step_content.get("permitInternalWorkflow") == True:
                step_content.update({"workflows": workflow})
                dc_connect.update_process_collection(
                    process_id=process_id,
                    data={"process_steps": steps, "processing_state": state},
                )
                return Response(process, status.HTTP_200_OK)
            else:
                return Response("Internal workflow is not permitted in this step", status.HTTP_403_FORBIDDEN)

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)


class ProcessLink(APIView):
    def post(self, request, process_id):
        """Get a link process for a person having notifications"""

        workspace_id = request.query_params.get("workspace_id")

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
            db_name = get_db(workspace_id)
            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            if not validate_id(process_id):
                return Response("Invalid process ID!", status.HTTP_400_BAD_REQUEST)

            # Retrieve link object
            link_object = dc_connect.get_documents_from_collection(
                filters={"process_id": process_id}, single=True
            )["data"]

            if not link_object:
                return Response("Verification link unavailable", status.HTTP_400_BAD_REQUEST)

            user_name = request.data.get("user_name")
            process = dc_connect.get_processes_from_collection(filters={"_id": process_id})["data"]

            if not process:
                return CustomResponse(False, "Process not found", status.HTTP_404_NOT_FOUND)

            # Check if the user has access to any step in the process
            process_steps = process[0].get("process_steps")
            for step in process_steps:
                step_clone_map = step.get("stepDocumentCloneMap")
                state = check_all_accessed(step_clone_map)
                if state:
                    link = link_object[0]["link"]
                    return Response(link, status.HTTP_200_OK)

            return Response("User is not part of this process", status.HTTP_401_UNAUTHORIZED)

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

class ProcessVerification(APIView):
    def post(self, request, process_id):
        """Verification of a process step access and checks for duplicate documents based on a step."""

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
            workspace_id = request.query_params.get("workspace_id")
            db_name = get_db(workspace_id)
            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            if not validate_id(process_id):
                return Response("Invalid process ID!", status.HTTP_400_BAD_REQUEST)

            user_type = request.data.get("user_type")
            auth_user = request.data.get("auth_username")
            auth_role = request.data.get("auth_role")
            auth_portfolio = request.data.get("auth_portfolio")
            token = request.data.get("token")
            org_name = request.data.get("org_name")
            collection_id = None

            # Retrieve link object based on the token
            link_object = dc_connect.get_qrcodes_from_collection(filters={"unique_hash": token}).get("data", [])
            if not link_object:
                return Response("Invalid link token!", status.HTTP_400_BAD_REQUEST)
            link_object = link_object[0]

            # Check user type and authorization
            if user_type in ("team", "user"):
                collection_id = request.data.get("collection_id")
                if not collection_id:
                    return Response("Collection ID is required for team/user access!", status.HTTP_400_BAD_REQUEST)
                if link_object.get("user_name") != auth_user or link_object.get("auth_portfolio") != auth_portfolio:
                    return Response("Unauthorized user!", status.HTTP_401_UNAUTHORIZED)

            # Retrieve the process based on the link object
            process = dc_connect.get_processes_from_collection(
                filters={"_id": link_object.get("process_id")},
                single=True
            ).get("data", [])
            if not process:
                return Response("Process not found!", status.HTTP_400_BAD_REQUEST)
            process = process[0]

            # Handle public user access
            if user_type == "public":
                for step in process.get("process_steps", []):
                    if step.get("stepRole") == auth_role:
                        for item in step.get("stepDocumentCloneMap", []):
                            if item.get(auth_user[0]):
                                collection_id = item.get(auth_user[0])

            # Get previous and next users/viewers
            prev_viewers, next_viewers = get_prev_and_next_users(process, auth_user, auth_role, user_type)
            user_email = request.data.get("user_email", "")
            process["org_name"] = org_name

            # Verify access and return editor link if successful
            handler = DataCubeHandleProcess(process, dc_connect=dc_connect)
            location = handler.verify_location(auth_role, {
                "city": request.data.get("city"),
                "country": request.data.get("country"),
                "continent": request.data.get("continent"),
            })
            if not location:
                return Response("Access from this location is not allowed!", status.HTTP_400_BAD_REQUEST)
            if not handler.verify_display(auth_role):
                return Response("Display rights do not allow access to this document!", status.HTTP_400_BAD_REQUEST)
            if not handler.verify_time(auth_role):
                return Response("Time limit for access to this document has elapsed!", status.HTTP_400_BAD_REQUEST)
            editor_link = handler.verify_access_v3(
                auth_role, auth_user, user_type, collection_id, prev_viewers, next_viewers, user_email
            )
            if editor_link:
                return Response(editor_link, status.HTTP_200_OK)
            else:
                return Response("Error accessing the document. Please try again!", status.HTTP_400_BAD_REQUEST)

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)


class TriggerProcess(APIView):
    def post(self, request, process_id):
        """Get process and begin processing it."""

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
            workspace_id = request.query_params.get("workspace_id")
            data_type = request.query_params.get("data_type")
            db_name = get_db(workspace_id)

            if not validate_id(process_id):
                return Response("Invalid process ID!", status.HTTP_400_BAD_REQUEST)

            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            process = dc_connect.get_processes_from_collection(
                filters={"_id": process_id},
                single=True
            ).get("data", [])

            if not process:
                return Response("Process not found!", status.HTTP_400_BAD_REQUEST)
            process = process[0]

            action = request.data.get("action")
            state = process.get("processing_state")

            if request.data.get("user_name") != process.get("created_by"):
                return Response("User unauthorized!", status.HTTP_403_FORBIDDEN)

            if action == "halt_process" and state != "paused":
                res = dc_connect.update_process_collection(
                    process_id=process_id,
                    data={
                        "process_steps": process.get("process_steps"),
                        "processing_state": "paused",
                    },
                )
                if res.get("success"):
                    return Response("Process has been paused until manually resumed!", status.HTTP_200_OK)

            if action == "process_draft" and state != "processing":
                verification_links = DataCubeHandleProcess(process, dc_connect=dc_connect).start()
                if verification_links:
                    return Response(verification_links, status.HTTP_200_OK)
                else:
                    return Response(f"The process is already in {state} state", status.HTTP_200_OK)

            # Return an error response if neither conditions are met
            return Response("Invalid action or process state!", status.HTTP_400_BAD_REQUEST)

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

class ProcessImport(APIView):
    def post(self, request, process_id):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
            workspace_id = request.query_params.get("workspace_id")
            data_type = request.query_params.get("data_type")
            db_name = get_db(workspace_id)

            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            data = request.data
            company_id = data.get("company_id")
            portfolio = data.get("portfolio")
            member = data.get("member")
            data_type = data.get("data_type")
            user_email = data.get("user_email", "")

            if not validate_id(process_id) or not validate_id(company_id):
                return Response("Invalid ID!", status.HTTP_400_BAD_REQUEST)

            old_process = dc_connect.get_processes_from_collection(
                filters={"_id": process_id},
                single=True
            ).get("data", [])

            if not old_process:
                return Response("Process not found!", status.HTTP_400_BAD_REQUEST)
            old_process = old_process[0]
            document_id = old_process.get("parent_item_id")
            workflow_id = old_process.get("workflow_construct_ids")
            old_document = dc_connect.get_documents_from_collection(
                {"_id": document_id},
                single=True
            ).get("data", [])

            if not old_document:
                return Response("Document not found!", status.HTTP_400_BAD_REQUEST)
            old_document = old_document[0]
            viewers = [{"member": member, "portfolio": portfolio}]
            new_document_data = {
                "document_name": old_document.get("document_name", ""),
                "content": old_document.get("content", ""),
                "created_by": member,
                "company_id": company_id,
                "page": old_document.get("page", ""),
                "data_type": data_type,
                "document_state": "draft",
                "auth_viewers": viewers,
                "document_type": "imports",
                "parent_id": None,
                "process_id": "",
                "folders": [],
                "message": "",
            }

            res = dc_connect.save_to_document_collection(new_document_data)
            if not res.get("success"):
                return Response("Failed to create document", status.HTTP_500_INTERNAL_SERVER_ERROR)

            metadata_data = {
                "document_name": old_document.get("document_name", ""),
                "collection_id": res["data"]["inserted_id"],
                "created_by": member,
                "company_id": company_id,
                "data_type": data_type,
                "document_state": "draft",
                "auth_viewers": viewers,
                "document_type": "imports",
            }
            res_metadata = dc_connect.save_to_document_metadata_collection(metadata_data)
            if not res_metadata.get("success"):
                return Response("Failed to create document metadata", status.HTTP_500_INTERNAL_SERVER_ERROR)
            metadata_id = res_metadata["data"]["inserted_id"]
            editor_link = dc_connect.access_editor_metadata(res["data"]["inserted_id"], "document", metadata_id, user_email)
            if not editor_link:
                return Response("Could not open document editor.", status.HTTP_500_INTERNAL_SERVER_ERROR)

            old_workflow = dc_connect.get_workflows_from_collection({"_id": workflow_id[0]}, single=True).get("data", [])
            if not old_workflow:
                return Response("Workflow not found!", status.HTTP_400_BAD_REQUEST)
            old_workflow = old_workflow[0]
            new_wf_title = old_workflow.get("workflows", {}).get("workflow_title", "")
            new_wf_steps = old_workflow.get("workflows", {}).get("steps", [])
            workflow_data = {
                "workflows": {
                    "workflow_title": new_wf_title,
                    "steps": new_wf_steps,
                },
                "company_id": company_id,
                "created_by": member,
                "portfolio": portfolio,
                "data_type": data_type,
                "workflow_type": "imports",
            }
            res_workflow = dc_connect.save_to_workflow_collection(workflow_data)
            if not res_workflow["success"]:
                return Response("Failed to create workflow", status.HTTP_500_INTERNAL_SERVER_ERROR)
            remove_members_from_steps(old_process)
            process_data = {
                "process_title": old_process.get("process_title", ""),
                "process_steps": old_process.get("process_steps", []),
                "created_by": member,
                "company_id": company_id,
                "data_type": data_type,
                "parent_item_id": res["data"]["inserted_id"],
                "processing_action": "imports",
                "creator_portfolio": portfolio,
                "workflow_construct_ids": [res_workflow["data"]["inserted_id"]],
                "process_type": old_process.get("process_type", ""),
                "process_kind": "import",
            }
            res_process = dc_connect.save_to_process_collection(process_data)
            if not res_process["success"]:
                return Response("Failed to create process", status.HTTP_500_INTERNAL_SERVER_ERROR)
            response_data = {
                "Message": "Workflow, document and process created successfully",
                "editor_link": editor_link,
                "document_id": res["data"]["inserted_id"],
                "workflow_id": res_workflow["data"]["inserted_id"],
                "process_id": res_process["data"]["inserted_id"],
            }
            return Response(response_data, status.HTTP_201_CREATED)
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

class ProcessCopies(APIView):
    def post(self, request, process_id):
        try:
            workspace_id = request.query_params.get("workspace_id")
            db_name = get_db(workspace_id)

            api_key = authorization_check(request.headers.get("Authorization"))

            dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=db_name)

            if not validate_id(process_id):
                return Response("Invalid process ID!", status.HTTP_400_BAD_REQUEST)

            if not request.data:
                return Response("Request data is missing!", status.HTTP_400_BAD_REQUEST)

            new_process_id = dc_connect.cloning_process(
                process_id,
                request.data.get("created_by", ""),
                request.data.get("portfolio", ""),
            )
            if new_process_id is None:
                return Response("Failed to clone process!", status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response("Successfully created a process clone", status.HTTP_201_CREATED)
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
