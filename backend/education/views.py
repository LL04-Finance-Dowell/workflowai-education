import ast
import json
import re
import secrets

import requests
from django.core.cache import cache
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.constants import EDITOR_API, PROCESS_COMPLETION_MAIL
from education.helpers import get_link
from education.checks import is_finalized
from education.datacube_connection import (DatacubeConnection,
                                           check_collections, create_db,
                                           get_master_db)
from education.datacube_processing import (DataCubeBackground,
                                           DataCubeHandleProcess,
                                           DataCubeProcess)
from education.helpers import (CustomResponse, InvalidTokenException,
                               authorization_check, check_all_accessed,
                               check_last_finalizer, check_progress,
                               decrypt_credentials, dowell_email_sender,
                               get_prev_and_next_users, paginate,
                                remove_finalized_reminder,
                               remove_members_from_steps, update_signed,
                               validate_id)
from education.serializers import *
from education.serializers import CreateCollectionSerializer

# Create your views here.
# Education views are created here
# Anywhere we see template_function_it is


class HomeView(APIView):
    def get(self, request):
        return Response({"Message": "Education is live"}, status.HTTP_200_OK)


class DatabaseServices(APIView):
    def get(self, request):
        """
        Check the existence of the needed database and its collections.
        """
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.query_params.get("workspace_id")
        # check master db
        data_database = get_master_db(workspace_id)
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=data_database, check=False)

        # Check databases and create missing collections where necessary
        # Check master collections if necessary
        needed_collections = list(dc_connect.master_collections.values())
        success, message = check_collections(dc_connect, needed_collections)
        if not success:
            return CustomResponse(False, message, None, status.HTTP_501_NOT_IMPLEMENTED)

        # Switch to workflow database and check collections
        dc_connect.database = dc_connect.workflow_db
        needed_collections = [dc_connect.master_collections["workflow"]]
        success, message = check_collections(dc_connect, needed_collections)
        if not success:
            return CustomResponse(False, message, None, status.HTTP_501_NOT_IMPLEMENTED)
        
        # Switch to master_links database and check collections
        dc_connect.database = dc_connect.master_links_db
        needed_collections = [dc_connect.master_collections["master_link"]]
        success, message = check_collections(dc_connect, needed_collections)
        if not success:
            return CustomResponse(False, message, None, status.HTTP_501_NOT_IMPLEMENTED)
        
        # Switch to public_id database and check collections
        dc_connect.database = dc_connect.public_id_db
        needed_collections = [dc_connect.master_collections["public_id"]]
        success, message = check_collections(dc_connect, needed_collections)
        if not success:
            return CustomResponse(False, message, None, status.HTTP_501_NOT_IMPLEMENTED)

        return CustomResponse(True, "Databases and collections are available to be used", None, status.HTTP_200_OK)
    
class NewTemplate(APIView):

    def get(self, request):
        workspace_id = request.query_params.get("workspace_id")
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        
        db_name = get_master_db(workspace_id)
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name, check=False
        )
        res = dc_connect.get_templates_from_master_db()
        if res["success"]:
            return Response(res)
        else:
            return CustomResponse(False, res["message"], None, status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        workspace_id = request.query_params.get("workspace_id")
        database = request.query_params.get("database")
        type_request = request.query_params.get("type")
        created_by = request.data.get("created_by")
        data_type = request.data.get("data_type")
        portfolio = request.data.get("portfolio")
        template_name = request.data.get("template_name", "Untitled Template")
        if not database:
            return CustomResponse(False, "database is required", status.HTTP_400_BAD_REQUEST)

        if type_request == "approve":
            return self.approve(request)
        
        if not database:
            return CustomResponse(False, "database is required", status.HTTP_400_BAD_REQUEST)

        data = ""
        page = ""
        folder = []

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(workspace_id):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

        
        if portfolio:

            new_db = create_db(api_key=api_key, database=database, workspace_id=workspace_id)
            # FIXME
            new_metadata_db = new_db

            if not new_db:
                return Response(
                    {"Message": "Error creating template database"},
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            dc_connect = DatacubeConnection(
                api_key=api_key, workspace_id=workspace_id, database=new_db, check=False
            )
            collection_name = dc_connect.collection_names.get("template")

            viewers = [{"member": created_by, "portfolio": portfolio}]
            template_data = {
                "template_name": template_name,
                "content": data,
                "page": page,
                "folders": folder,
                "created_by": created_by,
                "company_id": workspace_id,
                "data_type": data_type,
                "template_type": "draft",
                "auth_viewers": viewers,
                "message": "",
                "approval": False,
                "collection_name": collection_name,
                # "database": new_db, # not needed since it is done on each insertion
            }

            res = dc_connect.save_to_template_collection(data=template_data, no_template_id=True)
            if res["success"]:
                collection_id = res["data"]["inserted_id"]
                res_metadata = dc_connect.save_to_template_metadata_collection(
                    {
                        "template_name": template_name,
                        "created_by": created_by,
                        "collection_id": collection_id,
                        "data_type": data_type,
                        "company_id": workspace_id,
                        "auth_viewers": viewers,
                        "template_state": "draft",
                        "approval": False,
                        # "database": new_metadata_db, # not needed done on each insertion
                    },
                    database=new_metadata_db,
                )

                payload = {
                    "product_name": "workflowai",
                    "details": {
                        "_id": collection_id,
                        "field": "template_name",
                        "action": "template",
                        "metadata_id": res_metadata["data"]["inserted_id"],
                        "cluster": "Documents",
                        "database": new_db,
                        "collection": collection_name,
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
                editor_link = requests.post(
                    EDITOR_API,
                    data=json.dumps(payload),
                )
                return Response(
                    {
                        "editor_link": editor_link.json(),
                        "_id": res["data"]["inserted_id"],
                    },
                    status.HTTP_201_CREATED,
                )

        return Response({"Message": "Error creating template "}, status.HTTP_404_NOT_FOUND)

    def approve(self, request):
        """Post data for template approval
        :  Templates can only be used after approval True
        :  Collection_id is ID for template collection
        :  metadata_id is the ID for the metadata
        """
        database = request.query_params.get("database")
        workspace_id = request.query_params.get("workspace_id")
        if not database:
            return CustomResponse(False, "database is required", status.HTTP_400_BAD_REQUEST)
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)
        # NOTE compare
        update_data = {"approval": True}
        template_id = dc_connect.master_template_data["template_id"]
        template_metadata_id = dc_connect.master_template_data["template_metadata_id"]

        approval_update = dc_connect.update_template_collection(template_id=template_id, data=update_data)
        metadata_approval_update = dc_connect.update_template_metadata_collection(metadata_id=template_metadata_id, data=update_data)
        master_approval = dc_connect.update_master_template_collection(template_id=template_id, data=update_data)
        
        # FIXME: Whether the update was successful or not the success key is always True
        if approval_update["success"] and metadata_approval_update["success"] and master_approval["success"]:
            return CustomResponse(True, "Template approved", None, status.HTTP_200_OK)
        else:
            return CustomResponse(
                False, "Template approval failed", None, status.HTTP_400_BAD_REQUEST
            )


class TemplateDetail(APIView):
    def get(self, request, template_id):
        workspace_id = request.query_params.get("workspace_id")
        database = request.query_params.get("database")
        if not database:
            return CustomResponse(False, "database is required", status.HTTP_400_BAD_REQUEST)
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )
        # NOTE do we need to pass this filter being that only one template will exist in the template collection of each db?
        res = dc_connect.get_templates_from_collection({"_id": template_id})
        if res["success"]:
            return Response(res)
        else:
            return CustomResponse(False, res["message"], None, status.HTTP_400_BAD_REQUEST)


class Workflow(APIView):
    def get(self, request):
        """Get Workflows Created in a collection"""
        workspace_id = request.query_params.get("workspace_id")
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, workflow=True
        )
        res = dc_connect.get_workflows_from_collection(single=True)

        if res["success"]:
            return CustomResponse(True, "workflows found!", res["data"], status.HTTP_200_OK)

        else:
            return CustomResponse(
                False,
                "Couldn't fetch workflow collection",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        """Creates a new workflow"""
        workspace_id = request.query_params.get("workspace_id")
        wf_title = request.data.get("wf_title")
        steps = request.data.get("steps")
        created_by = request.data.get("created_by")
        portfolio = request.data.get("portfolio")
        data_type = request.data.get("data_type")
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, workflow=True
        )

        data = {
            "workflow_title": wf_title,
            "steps": steps,
        }

        res = dc_connect.save_to_workflow_collection(
            {
                "workflows": data,
                "company_id": workspace_id,
                "created_by": created_by,
                "portfolio": portfolio,
                "data_type": data_type,
                "workflow_type": "original",
            },
        )
        if res["success"]:
            return Response(
                {
                    "_id": res["data"]["inserted_id"],
                    "workflows": data,
                    "created_by": created_by,
                    "company_id": workspace_id,
                    "workflow_type": "original",
                    "data_type": data_type,
                },
                status.HTTP_201_CREATED,
            )
        else:
            return CustomResponse(
                False,
                "Workflow Not created",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

    def put(self, request):
        workspace_id = request.query_params.get("workspace_id")
        workflow_id = request.data.get("workflow_id")
        update_data = request.data.get("update_data")
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)


        query = {"_id": workflow_id}
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, workflow=True
        )
        collection = dc_connect.collection_names.get("workflow")
        update_workflow = dc_connect.post_data_to_collection(
            collection, update_data, "update", query
        )
        if update_workflow:
            return CustomResponse(
                True, "Workflow updated successfully", None, status.HTTP_201_CREATED
            )
        else:
            return CustomResponse(
                False, update_workflow["message"], None, status.HTTP_400_BAD_REQUEST
            )


class CollectionData(APIView):
    def post(self, request):
        api_key = request.data.get("api_key")
        database = request.data.get("db_name")
        collection = request.data.get("coll_name")
        filters = request.data.get("filters")
        limit = request.data.get("limit")
        offset = request.data.get("offset")

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id="", database=database)

        res = dc_connect.get_data_from_collection(collection, filters, limit, offset)

        return Response(res, status.HTTP_200_OK)


class AddToCollection(APIView):
    def post(self, request):
        api_key = request.data.get("api_key")
        database = request.data.get("db_name")
        collection = request.data.get("coll_name")
        filters = request.data.get("filters")
        limit = request.data.get("limit")
        offset = request.data.get("offset")

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id="", database=database)

        res = dc_connect.get_data_from_collection(collection, filters, limit, offset)

        return Response(res, status.HTTP_200_OK)


class NewDocument(APIView):

    def post(self, request):
        workspace_id = request.query_params.get("workspace_id")
        database = request.query_params.get("database")
        created_by = request.data.get("created_by")
        data_type = request.data.get("data_type")
        portfolio = request.data.get("portfolio")

        if not workspace_id or not created_by or not data_type:
            return CustomResponse(
                False,
                "workspace_id, created_by and data_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not database:
            return CustomResponse(False, "database is required", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        isapproved = dc_connect.master_template_data["approval"]

        if not isapproved:
            return CustomResponse(
                False, "Template in this database is not approved", None, status.HTTP_403_FORBIDDEN
            )
        
        template_id = dc_connect.master_template_data["template_id"]
        viewers = [{"member": created_by, "portfolio": portfolio}]
        template = dc_connect.get_templates_from_collection({"_id": template_id})

        document_data = {
            "document_name": "Untitled Document",
            "content": template["data"][0].get("content"),
            "created_by": created_by,
            "company_id": workspace_id,
            "page": template["data"][0]["page"],
            "data_type": data_type,
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "original",
            "collection_name": dc_connect.collection_names["document"],
            "process_id": "",
            "folders": [],
        }

        res = dc_connect.save_to_document_collection(document_data)

        if res["success"]:
            collection_id = res["data"]["inserted_id"]
            # NOTE compare
            res_metadata = dc_connect.save_to_document_metadata_collection(
                {
                    "document_name": "Untitled Document",
                    "created_by": created_by,
                    "collection_id": collection_id,
                    "data_type": data_type,
                    "company_id": workspace_id,
                    "auth_viewers": viewers,
                    "document_state": "draft",
                }
            )

            if not res_metadata["success"]:
                return CustomResponse(
                    False,
                    "An error occured while trying to save document metadata",
                    None,
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return CustomResponse(
            True,
            {"_id": res["data"]["inserted_id"], "doc_status": "document created"},
            None,
            status.HTTP_201_CREATED,
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
        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)


        if not database:
            dc_connect = DatacubeConnection(
                api_key=api_key, workspace_id=workspace_id, database=get_master_db(workspace_id), check=False
            )
            document_list = dc_connect.get_documents_from_master_db()
            return Response(
                {"documents": document_list},
                status=status.HTTP_200_OK,
            )

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        if not document_type or not document_state or not workspace_id:
            return CustomResponse(
                False,
                "document_type, workspace_id and document_state are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )
        if not validate_id(company_id) or not data_type:
            return CustomResponse(False, "Invalid Request!", None, status.HTTP_400_BAD_REQUEST)

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

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
            )

        if not document_type or not workspace_id:
            return CustomResponse(
                False,
                "workspace_id and document_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        if not validate_id(item_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        if document_type == "document":
            # NOTE compare
            document = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)

        elif document_type == "clone":
            # NOTE compare
            document = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)

        if document:
            portfolio = request.query_params.get("portfolio", "")

            # FIXME: we can pass the document object instead of the item_id to reduce num of api requests
            editor_link = dc_connect.access_editor(
                item_id,
                document_type,
                portfolio=portfolio,
            )
            if not editor_link:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(editor_link, status.HTTP_200_OK)
        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)


class DocumentDetail(APIView):
    def get(self, request, item_id):
        """Retrieves the document object for a specific document"""
        workspace_id = request.query_params.get("workspace_id")
        document_type = request.query_params.get("document_type")
        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        if not workspace_id or not document_type:
            return CustomResponse(
                False,
                "workspace_id and document_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

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
        """Content map of a given document or a template or a clone"""
        # FIXME This doesn't work. I am Unable to get content for the content field
        content = []
        item_type = request.query_params.get("item_type")
        workspace_id = request.query_params.get("workspace_id")
        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        if not validate_id(item_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        content = []
        item_type = request.query_params.get("item_type")
        if item_type == "template":
            my_dict = ast.literal_eval(
                dc_connect.get_templates_from_collection({"_id": item_id}, single=True)["data"][0][
                    "content"
                ]
            )[0][0]
        else:
            my_dict = ast.literal_eval(
                dc_connect.get_documents_from_collection({"_id": item_id}, single=True)["data"][0][
                    "content"
                ]
            )[0][0]
        all_keys = [i for i in my_dict.keys()]
        for i in all_keys:
            temp_list = []
            for j in my_dict[i]:
                if "data" in j:
                    if j["type"] == "CONTAINER_INPUT":
                        container_list = []
                        for item in j["data"]:
                            container_list.append({"id": item["id"], "data": item["data"]})
                        temp_list.append({"id": j["id"], "data": container_list})
                    else:
                        temp_list.append({"id": j["id"], "data": j["data"]})
                else:
                    temp_list.append({"id": j["id"], "data": ""})
            content.append(
                {
                    i: temp_list,
                }
            )
        sorted_content = []
        for dicts in content:
            for key, val in dicts.items():
                sorted_content.append(
                    {
                        key: sorted(
                            dicts[key],
                            key=lambda x: int([a for a in re.findall("\d+", x["id"])][-1]),
                        )
                    }
                )
        return Response(sorted_content, status.HTTP_200_OK)


class FinalizeOrReject(APIView):
    def post(self, request, process_id, *args, **kwargs):
        """After access is granted and the user has made changes on a document."""

        if not validate_id(process_id):
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        payload_dict = kwargs.get("payload")
        if payload_dict:
            request_data = payload_dict
        else:
            request_data = request.data

        if not request_data:
            return Response("you are missing something", status.HTTP_400_BAD_REQUEST)

        # NOTE should authorization check be done here?
        api_key = request.data["api_key"]
        workspace_id = request.data["workspace_id"]
        database = request.data["database"]
        item_id = request_data["item_id"]
        item_type = request_data["item_type"]
        role = request_data["role"]
        user = request_data["authorized"]
        user_type = request_data["user_type"]
        state = request_data["action"]
        message = ""

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        if state == "rejected":
            message = request_data.get("message", None)
            if not message:
                return Response(
                    "provide a reason for rejecting the document",
                    status=status.HTTP_400_BAD_REQUEST,
                )
        check, current_state = is_finalized(item_id, item_type, dc_connect)
        if item_type == "document" or item_type == "clone":
            if check and current_state != "processing":
                return Response(
                    f"document already processed as `{current_state}`!",
                    status.HTTP_200_OK,
                )
        elif item_type == "template":
            if check and current_state != "draft":
                return Response(
                    f"template already processed as `{current_state}`!",
                    status.HTTP_200_OK,
                )
        if item_type == "clone":
            sl_data = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)["data"]
            signers_list = sl_data[0].get("signed_by") if sl_data else None
            updated_signers_true = update_signed(signers_list, member=user, status=True)

        res = dc_connect.finalize_item(item_id, state, item_type, message, updated_signers_true)

        if res["success"]:
            # Check the finalize action, no need to check document state since the finalize_item() call was successful
            if state == "rejected":
                try:
                    process = dc_connect.get_processes_from_collection(
                        {"_id": process_id}, single=True
                    )["data"]
                    process_steps = process[0].get("process_steps")
                    process_data = {"process_steps": process_steps, "processing_state": state}
                    dc_connect.update_process_collection(process_id, process_data)
                    return Response("document rejected successfully", status.HTTP_200_OK)
                except Exception as e:
                    # Revert document and process states back to "processing"
                    dc_connect.finalize_item(item_id, "processing", item_type, signers=None)
                    process_data = {
                        "process_steps": process_steps,
                        "processing_state": "processing",
                    }
                    dc_connect.update_process_collection(process_id, process_data)
                    return Response(
                        f"an error occurred while rejecting the process {e}",
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            else:
                # Process item normally
                try:
                    process = dc_connect.get_processes_from_collection(
                        {"_id": process_id}, single=True
                    )["data"][0]
                    background = DataCubeBackground(
                        process, item_type, item_id, role, user, message
                    )
                    if user_type == "public":
                        link_id = request_data.get("link_id")
                        dc_connect.register_finalized(link_id)
                    if item_type == "document" or item_type == "clone":
                        background.document_processing()
                        item = dc_connect.get_clones_from_collection(
                            {"_id": item_id}, single=True
                        )["data"]
                        if item:
                            item = item[0]
                            if item.get("document_state") == "finalized":
                                meta_id = dc_connect.get_metadata_id(item_id, item_type)
                                updated_process = dc_connect.get_processes_from_collection(
                                    {"_id": process_id}, single=True
                                )["data"][0]
                                process_state = updated_process.get("processing_state")
                                if (
                                    process.get("process_type") == "internal"
                                    and process_state == "finalized"
                                ):
                                    process_creator = process.get("created_by")
                                    process_creator_portfolio = process.get("creator_portfolio")
                                    parent_process = process.get("parent_process")
                                    user_dict = {
                                        "member": process_creator,
                                        "portfolio": process_creator_portfolio,
                                    }
                                    dc_connect.authorize(
                                        item_id, user_dict, parent_process, "document"
                                    )
                                    dc_connect.authorize_metadata(
                                        meta_id, user_dict, parent_process, "document"
                                    )

                                else:
                                    dc_connect.update_metadata(
                                        meta_id,
                                        "finalized",
                                        item_type,
                                        signers=updated_signers_true,
                                    )
                            elif item.get("document_state") == "processing":
                                meta_id = dc_connect.get_metadata_id(item_id, item_type)
                        if check_last_finalizer(user, user_type, process):
                            subject = f"Completion of {process['process_title']} Processing"
                            email = process.get("email", None)
                            if email:
                                dowell_email_sender(
                                    process["created_by"],
                                    email,
                                    subject,
                                    email_content=PROCESS_COMPLETION_MAIL,
                                )

                        # Remove Reminder after finalization
                        remove_finalized_reminder(user, process_id)

                        return Response("document processed successfully", status.HTTP_200_OK)
                    elif item_type == "template":
                        background.template_processing()
                        item = dc_connect.get_templates_from_collection(
                            {"_id": item_id}, single=True
                        )["data"]
                        if item:
                            item = item[0]
                            if item.get("template_state") == "saved":
                                meta_id = dc_connect.get_metadata_id(item_id, item_type)
                                updated_signers_true = update_signed(
                                    signers_list, member=user, status=True
                                )
                                dc_connect.update_metadata(
                                    meta_id,
                                    "saved",
                                    item_type,
                                    signers=updated_signers_true,
                                )
                            elif item.get("template_state") == "draft":
                                meta_id = dc_connect.get_metadata_id(item_id, item_type)
                                dc_connect.update_metadata(meta_id, "draft", item_type)

                        if check_last_finalizer(user, user_type, process):
                            subject = f"Completion of {process['process_title']} Processing"
                            email = process.get("email", None)
                            if email:
                                dowell_email_sender(
                                    process["created_by"],
                                    email,
                                    subject,
                                    email_content=PROCESS_COMPLETION_MAIL,
                                )

                        # Remove Reminder after finalization
                        remove_finalized_reminder(user, process_id)

                        return Response("template processed successfully", status.HTTP_200_OK)

                except Exception as err:
                    print(err)
                    return Response(
                        "An error occured during processing",
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

    def get(self, request, process_id):
        return Response("Success", status.HTTP_200_OK)


class FinalizeOrRejectEducation(APIView):
    def post(self, request, collection_id):
        """After access is granted and the user has made changes on a document."""
        if not validate_id(collection_id):
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        # NOTE why wasn't authorization check done here?

        if not request.data:
            return Response("you are missing something", status.HTTP_400_BAD_REQUEST)

        api_key = request.data["api_key"]
        collection_name = request.data["coll_name"]
        api_key = request.data["api_key"]
        workspace_id = request.data["workspace_id"]

        item_id = request.data["item_id"]
        item_type = request.data["item_type"]
        role = request.data["role"]
        user = request.data["authorized"]
        user_type = request.data["user_type"]
        state = request.data["action"]
        message = request.data.get("message", None)
        link_id = request.data.get("link_id", None)
        product = request.data.get("product", "education")
        database = request.query_params.get("database")

        # FIXME add checks for database

        # NOTE compare; Why was PROCESS_DB_0 used?
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

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
        # #print("filter: ", query)
        data = dc_connect.get_data_from_collection(collection_name, filters=query, limit=1)
        process_id = data["data"][0].get("process").get("_id")

        res = FinalizeOrReject().post(request, process_id, payload=payload)

        # if res.status_code == 200:
        process = dc_connect.get_processes_from_collection(filters={"_id": process_id})["data"]
        if not process:
            return CustomResponse(
                False, "Document could not be accessed!", None, status.HTTP_404_NOT_FOUND
            )
        dc_connect.update_process_collection(
            process_id=collection_id,
            data={"process": process[0]},
        )

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
        database = request.query_params.get("database")

        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)

        # NOTE compare; Why was PROCESS_DB_0 used?
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        cache_key = f"folders_{company_id}"
        folders_list = cache.get(cache_key)
        if folders_list is None:
            try:
                folders_list = dc_connect.get_folders_from_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, folders_list, timeout=60)
            except:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
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
        database = request.query_params.get("database")

        # FIXME add checks for database

        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        if not all([folder_name, created_by, company_id, data_type]):
            return CustomResponse(False, "Invalid Request!", None, status.HTTP_400_BAD_REQUEST)

        data = []
        if not validate_id(request.data["company_id"]):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

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
            return CustomResponse(
                True,
                res["data"]["inserted_id"],
                None,
                status.HTTP_201_CREATED,
            )


class FolderDetail(APIView):
    def get(self, request, folder_id):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(folder_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        workspace_id = request.query_params.get("workspace_id")
        database = request.query_params.get("database")

        # FIXME add checks for database

        # NOTE compare; Why was PROCESS_DB_0 used?
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=workspace_id, database=database)

        folder_details = dc_connect.get_folders_from_collection({"_id": folder_id}, single=True)
        return Response(folder_details, status.HTTP_200_OK)

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
        """processing is determined by action picked by user."""
        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.query_params.get("workspace_id")
        database = request.query_params.get("database")

        # FIXME add checks for database
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
        if action == "save_workflow_to_document_and_save_to_drafts":
            process.normal_process(action)
            return Response("Process Saved in drafts.", status.HTTP_201_CREATED)

        elif action == "start_document_processing_content_wise":
            if process_id is not None:
                process = dc_connect.get_processes_from_collection(
                    filters={"_id": process_id},
                    single=True,
                )["data"]
            else:
                data = process.normal_process(action)

        elif action == "start_document_processing_wf_steps_wise":
            if process_id is not None:
                process = dc_connect.get_processes_from_collection(
                    filters={"_id": process_id},
                    single=True,
                )["data"]
            else:
                data = process.normal_process(action)

        elif action == "start_document_processing_wf_wise":
            if process_id is not None:
                process = dc_connect.get_processes_from_collection(
                    filters={"_id": process_id},
                    single=True,
                )["data"]
            else:
                data = process.normal_process(action)

        elif action == "test_document_processing_content_wise":
            if process_id is not None:
                process = dc_connect.get_processes_from_collection(
                    filters={"_id": process_id},
                    single=True,
                )["data"]
            else:
                data = process.test_process(action)

        elif action == "test_document_processing_wf_steps_wise":
            if process_id is not None:
                process = dc_connect.get_processes_from_collection(
                    filters={"_id": process_id},
                    single=True,
                )["data"]
            else:
                data = process.test_process(action)

        elif action == "test_document_processing_wf_wise":
            if process_id is not None:
                process = dc_connect.get_processes_from_collection(
                    filters={"_id": process_id},
                    single=True,
                )["data"]
            else:
                data = process.test_process(action)

        elif action == "close_processing_and_mark_as_completed":
            process = dc_connect.get_processes_from_collection(
                filters={"_id": process_id},
                single=True,
            )["data"]
            if process:
                process = process[0]

            if process["processing_state"] == "completed":
                return Response("This Workflow process is already complete", status.HTTP_200_OK)
            res = dc_connect.update_process_collection(
                process_id=process["process_id"],
                data={
                    "process_steps": process["processing_steps"],
                    "processing_state": "completed",
                },
            )
            if res["success"]:
                return Response("Process closed and marked as complete!", status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif action == "cancel_process_before_completion":
            process = dc_connect.get_processes_from_collection(
                filters={"_id": process_id}, single=True
            )["data"]

            if process:
                process = process[0]

            if process["processing_state"] == "cancelled":
                return Response("This Workflow process is Cancelled!", status.HTTP_200_OK)
            res = dc_connect.update_process_collection(
                process_id=process[0]["process_id"],
                data={
                    "process_steps": process["processing_steps"],
                    "processing_state": "cancelled",
                },
            )
            if res["success"]:
                return Response("Process closed and marked as canalled!", status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif action == "pause_processing_after_completing_ongoing_step":
            return Response(
                "This Option is currently in development",
                status.HTTP_501_NOT_IMPLEMENTED,
            )
        if data:
            verification_links = DataCubeHandleProcess(data, dc_connect=dc_connect, request=request).start()
            return Response(verification_links, status.HTTP_200_OK)
        return Response()


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

        database = request.query_params.get("database")

        # FIXME add checks for database
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )
        process_state = request.query_params.get("process_state")

        if process_state:
            completed = dc_connect.get_processes_from_collection(
                filters={
                    "company_id": company_id,
                    "data_type": data_type,
                    "processing_state": process_state,
                }
            )
            page = int(request.GET.get("page", 1))
            data = paginate(completed["data"], page, 50)
            completed["data"] = data
            return Response(completed, status.HTTP_200_OK)
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
        """get process by process id"""
        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        process = dc_connect.get_processes_from_collection(
            filters={"_id": process_id}, single=True
        )["data"]

        if not process:
            return CustomResponse(False, "process not found", status.HTTP_404_NOT_FOUND)

        process = process[0]
        progress = check_progress(process)
        parent_id = process["parent_item_id"]

        if parent_id:
            # NOTE compare
            document = dc_connect.get_documents_from_collection({"_id": parent_id}, single=True)[
                "data"
            ]
            if document:
                document_name = document[0]["document_name"]
                process.update({"document_name": document_name})

            # NOTE compare; also need single arg?
            links = dc_connect.get_links_from_collection(
                filters={"process_id": process["_id"]},
            )["data"]

            if links:
                # NOTE confirm
                links_object = links[0]
                process.update({"links": links_object["link"]})

        process["progress"] = progress
        return Response(process, status.HTTP_200_OK)

    def put(self, request, process_id):
        """_summary_
        Args:
            request (req): _description_
            process_id (str): _description_
        """

        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        if not request.data:
            return Response("Some parameters are missing", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        workflow = request.data.get("workflows")
        step_id = request.data.get("step_id")
        step_id -= 1
        process = dc_connect.get_processes_from_collection(
            filters={
                "_id": process_id,
                # "data_type": data_type,
            },
            single=True,
        )
        data = process["data"]
        if not data:
            return CustomResponse(False, process["message"], None, status.HTTP_404_NOT_FOUND)

        steps = data[0].get("process_steps")
        # NOTE in during the creation of a process when DataCubeProcess.start is called, the processing_state was set as "processing"
        state = "processing_state"
        step_content = steps[step_id]
        if step_content.get("permitInternalWorkflow") == True:
            step_content.update({"workflows": workflow})
            dc_connect.update_process_collection(
                process_id=process_id,
                data={
                    "process_steps": steps,
                    "processing_state": state,
                    # "data_type": data_type,
                },
            )
            return Response(process, status.HTTP_200_OK)
        else:
            return Response(
                "Internal workflow is not permitted in this step",
                status.HTTP_403_FORBIDDEN,
            )


class ProcessLink(APIView):
    def post(self, request, process_id):
        """get a link process for person having notifications"""

        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        database = request.query_params.get("database")

        # FIXME add checks for database
        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        # only one link as opposed to links in views_v2
        links_info = dc_connect.get_links_from_collection(
            filters={"process_id": process_id}, single=True
        )["data"]

        if not links_info:
            return Response("Verification link unavailable", status.HTTP_400_BAD_REQUEST)
        
        user = request.data["user_name"]
        process = dc_connect.get_processes_from_collection(
            filters={
                "_id": process_id,
                # "data_type": data_type,
            },
        )["data"]

        if not process:
            return CustomResponse(False, "process not found", status.HTTP_404_NOT_FOUND)

        # NOTE confirm
        process_steps = process[0].get("process_steps")
        for step in process_steps:
            step_clone_map = step.get("stepDocumentCloneMap")
            step_role = step.get("stepRole")
            state = check_all_accessed(step_clone_map)
            if state:
                pass
            else:
                link = get_link(user, step_role, links_info)
                if link:
                    return Response(link, status.HTTP_200_OK)
        
        return Response(
            "user is not part of this process", status.HTTP_401_UNAUTHORIZED
        )

class ProcessVerification(APIView):
    def post(self, request, token):
        """verification of a process step access and checks that duplicate document based on a step."""

        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        user_type = request.query_params["user_type"]
        auth_user = request.query_params["username"]
        auth_role = request.query_params["auth_role"]
        auth_portfolio = request.query_params["portfolio"]
        # token = request.query_params["token"]
        org_name = request.query_params["org"]
        collection_id = None
        # only one link as opposed to links in views_v2
        # NOTE compare
        link_object = dc_connect.get_qrcodes_from_collection(
            filters={"unique_hash": token},
        )["data"]
        if not link_object:
            return Response("Some link error here", status.HTTP_400_BAD_REQUEST)
        link_object = link_object[0]
        if user_type == "team" or user_type == "user":
            collection_id = (
                request.data["collection_id"] if request.data.get("collection_id") else None
            )
            if (
                link_object["user_name"] != auth_user
                or link_object["auth_portfolio"] != auth_portfolio
            ):
                return Response(
                    "User Logged in is not part of this process",
                    status.HTTP_401_UNAUTHORIZED,
                )
        # NOTE if the process_id used is from link object why are we passing process_id in the url path?
        process = dc_connect.get_processes_from_collection(
            filters={
                "_id": link_object["process_id"],
                # "data_type": data_type,
            },
            single=True,
        )["data"]

        if not process:
            return Response("Some process error here", status.HTTP_400_BAD_REQUEST)
        process = process[0]
        if user_type == "public":
            for step in process["process_steps"]:
                if step.get("stepRole") == auth_role:
                    for item in step["stepDocumentCloneMap"]:
                        if item.get(auth_user[0]):
                            # Assign Collection ID
                            collection_id = item.get(auth_user[0])

        # Get previous and next users/viewers
        prev_viewers, next_viewers = get_prev_and_next_users(
            process, auth_user, auth_role, user_type
        )
        user_email = request.data.get("user_email") if request.data.get("user_email") else ""
        process["org_name"] = org_name
        handler = DataCubeHandleProcess(process, dc_connect=dc_connect, request=request)
        location = handler.verify_location(
            auth_role,
            {
                "city": request.data["city"],
                "country": request.data["country"],
                "continent": request.data["continent"],
            },
        )
        if not location:
            return Response(
                "access to this document not allowed from this location",
                status.HTTP_400_BAD_REQUEST,
            )
        if not handler.verify_display(auth_role):
            return Response(
                "display rights set do not allow access to this document",
                status.HTTP_400_BAD_REQUEST,
            )
        if not handler.verify_time(auth_role):
            return Response(
                "time limit for access to this document has elapsed",
                status.HTTP_400_BAD_REQUEST,
            )
        editor_link = handler.verify_access_v3(
            auth_role,
            auth_user,
            user_type,
            process["parent_item_id"],
            process["_id"],
            collection_id,
            prev_viewers,
            next_viewers,
            user_email,
        )
        if editor_link:
            return Response(editor_link, status.HTTP_200_OK)
        else:
            return Response(
                "Error accessing the requested document, Retry opening the document again :)",
                status.HTTP_400_BAD_REQUEST,
            )


class TriggerProcess(APIView):
    def post(self, request, process_id):
        """Get process and begin processing it."""

        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        process = dc_connect.get_processes_from_collection(
            filters={
                "_id": process_id,
                # "data_type": data_type,
            },
            single=True,
        )["data"]

        if not process:
            return Response("Some process error here", status.HTTP_400_BAD_REQUEST)
        process = process[0]
        action = request.data["action"]
        state = process["processing_state"]
        if request.data["user_name"] != process["created_by"]:
            return Response("User Unauthorized", status.HTTP_403_FORBIDDEN)
        if action == "halt_process" and state != "paused":
            res = dc_connect.update_process_collection(
                process_id=process_id,
                data={
                    "process_steps": process["process_steps"],
                    "processing_state": "paused",
                    # "data_type": data_type,
                },
            )
            if res["success"]:
                return Response(
                    "Process has been paused until manually resumed!",
                    status.HTTP_200_OK,
                )
        if action == "process_draft" and state != "processing":
            verification_links = DataCubeHandleProcess(process, dc_connect=dc_connect, request=request).start()
            if verification_links:
                return Response(verification_links, status.HTTP_200_OK)
            else:
                return Response(
                    f"The process is already in {state} state",
                    status.HTTP_200_OK,
                )
        # NOTE Potential error: what is supposed to happen if neither conditions are met?


class ProcessImport(APIView):
    def post(self, request, process_id):
        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        data = request.data
        company_id = data.get("company_id")
        portfolio = data.get("portfolio")
        member = data.get("member")
        data_type = data.get("data_type")
        # NOTE confirm
        user_email = request.data.get("user_email") if request.data.get("user_email") else ""

        if not validate_id(process_id) or not validate_id(company_id):
            return Response("Invalid_ID!", status.HTTP_400_BAD_REQUEST)

        old_process = dc_connect.get_processes_from_collection(
            filters={
                "_id": process_id,
                # "data_type": data_type,
            },
            single=True,
        )["data"]

        if not old_process:
            return Response("Some process error here", status.HTTP_400_BAD_REQUEST)
        old_process = old_process[0]
        document_id = old_process.get("parent_item_id")
        workflow_id = old_process.get("workflow_construct_ids")
        old_document = dc_connect.get_documents_from_collection(
            {"_id": document_id},
            single=True,
        )["data"]
        if not old_document:
            return Response("Some document error here", status.HTTP_400_BAD_REQUEST)
        old_document = old_document[0]
        viewers = [{"member": member, "portfolio": portfolio}]
        new_document_data = {
            "document_name": old_document["document_name"],
            "content": old_document["content"],
            "created_by": member,
            "company_id": company_id,
            "page": old_document["page"],
            "data_type": data_type,
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "imports",
            "parent_id": None,
            "process_id": "",
            "folders": [],
            "message": "",
        }

        res = dc_connect.save_to_document_collection(
            new_document_data,
        )
        if not res["success"]:
            return Response("Failed to create document", status.HTTP_500_INTERNAL_SERVER_ERROR)
        metadata_data = {
            "document_name": old_document["document_name"],
            "collection_id": res["data"]["inserted_id"],
            "created_by": member,
            "company_id": company_id,
            "data_type": data_type,
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "imports",
        }
        res_metadata = dc_connect.save_to_document_metadata_collection(
            metadata_data,
        )
        if not res_metadata.get("success"):
            return Response(
                "Failed to create document metadata",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        metadata_id = res_metadata["data"]["inserted_id"]
        editor_link = dc_connect.access_editor_metadata(
            res["data"]["inserted_id"], "document", metadata_id, user_email
        )
        if not editor_link:
            return Response(
                "Could not open document editor.", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        old_workflow = dc_connect.get_workflows_from_collection(
            {"_id": workflow_id[0]},
            single=True,
        )["data"]
        if not old_workflow:
            return Response("Some workflow error here.", status.HTTP_400_BAD_REQUEST)
        old_workflow = old_workflow[0]
        new_wf_title = old_workflow["workflows"]["workflow_title"]
        new_wf_steps = old_workflow["workflows"]["steps"]
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
        res_workflow = dc_connect.save_to_workflow_collection(
            workflow_data,
        )
        if not res_workflow["success"]:
            return Response("Failed to create workflow", status.HTTP_500_INTERNAL_SERVER_ERROR)
        remove_members_from_steps(old_process)
        process_data = {
            "process_title": old_process["process_title"],
            "process_steps": old_process["process_steps"],
            "created_by": member,
            "company_id": company_id,
            "data_type": data_type,
            "parent_item_id": res["data"]["inserted_id"],
            "processing_action": "imports",
            "creator_portfolio": portfolio,
            "workflow_construct_ids": [res_workflow["data"]["inserted_id"]],
            "process_type": old_process["process_type"],
            "process_kind": "import",
        }

        res_process = dc_connect.save_to_process_collection(
            process_data,
        )
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


class ProcessCopies(APIView):
    def post(self, request, process_id):
        workspace_id = request.query_params.get("workspace_id")

        database = request.query_params.get("database")

        # FIXME add checks for database

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        if not validate_id(process_id):
            return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)

        if not request.data:
            return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)

        process_id = dc_connect.cloning_process(
            process_id,
            request.data["created_by"],
            request.data["portfolio"],
        )
        if process_id is None:
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("success created a process clone", status.HTTP_201_CREATED)


class MasterLink(APIView):
    def get(self, request, link_id, token):
        api_key, workspace_id = decrypt_credentials(token)
        db_name = get_master_db(workspace_id)
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name, check=False
        )
        master_link = dc_connect.get_links_from_master_collection({"master_link_id": link_id}, single=True)["data"]
        if not master_link:
            return CustomResponse(False, "invalid link", None, 400)
        
        master_link = master_link[0]
        database = master_link["database"]
        dc_connect.database = database
        link = dc_connect.get_links_from_collection({"master_link_id": link_id, "is_finalized": False, "is_opened": False}, single=True)["data"]
        if link:
            link = link[0]
            dc_connect.update_links_collection(link["_id"], {"is_opened": True})
            return redirect(link["link"])
        return CustomResponse(False, "Link not found or is finalized", None, 404)
        

class ListPublicIds(APIView):
    def get(self, request):
        workspace_id = request.query_params.get("workspace_id")
        type = request.query_params.get("type")
        num = request.query_params.get("num", 10)
        try:
            num = int(num)
        except ValueError:
            return CustomResponse(False, "num must be an integer", None, status.HTTP_401_UNAUTHORIZED)

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, public_id=True
        )
       
        if type not in ["used", "unused"]:
            return CustomResponse(False, "type must be one of ['used', 'unused']", None, status.HTTP_400_BAD_REQUEST)

        if type.lower() == "used":
            public_ids = dc_connect.get_used_public_ids(num)
        else:
            public_ids = dc_connect.get_unused_public_ids(num)

        return Response(public_ids, status.HTTP_200_OK)


class AddPublicIds(APIView):
    def post(self, request):
        workspace_id = request.query_params.get("workspace_id")
        num = request.query_params.get("num", 10)
        try:
            num = int(num)
        except ValueError:
            return CustomResponse(False, "num must be an integer", None, status.HTTP_401_UNAUTHORIZED)
        
        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, public_id=True
        )

        public_ids = request.data.get("public_ids")
        if not public_ids or not isinstance(public_ids, list):
            public_ids = []
            for _ in range(num):
                public_ids.append(secrets.token_urlsafe(12))
        
        # for id in public_ids:
        #     dc_connect.save_to_public_id_collection({"public_id": id, "used": False})
        
        dc_connect.save_to_public_id_collection(public_ids)

        return Response(public_ids, status.HTTP_201_CREATED)

        