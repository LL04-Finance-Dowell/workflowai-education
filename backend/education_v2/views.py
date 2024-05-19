import ast
import json
import re

import requests
from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.constants import EDITOR_API
from app.helpers import (
    check_all_accessed,
    get_prev_and_next_users,
    paginate,
    remove_members_from_steps,
    validate_id,
)
from app.views_v2 import FinalizeOrReject
from education_v2 import datacube_processing
from education_v2.datacube_connection import DatacubeConnection
from education_v2.helpers import (
    CustomResponse,
    InvalidTokenException,
    authorization_check,
    check_progress,
)
from education_v2.serializers import *
from education_v2.serializers import CreateCollectionSerializer

# Create your views here.
# Education views are created here
# Anywhere we see template_function_it is


class HomeView(APIView):
    def get(self, request):
        return Response({"Message": "Education is live"}, status.HTTP_200_OK)


class DatabaseServices(APIView):

    def post(self, request):
        type_request = request.GET.get("type")

        if type_request == "create_collection":
            return self.create_collection(request)
        else:
            return self.handle_error(request)

    def get(self, request):
        type_request = request.GET.get("type")

        if type_request == "check_metadata_database_status":
            return self.check_metadata_database_status(request)
        elif type_request == "check_data_database_status":
            return self.check_data_database_status(request)
        else:
            return self.handle_error(request)

    def create_collection(self, request):
        """
        Create a new collection from the given database

        This method helps to create a new collection in the specified database.

        :param database_type: The type of the database, which can be META DATA or DATA.
        :param workspace_id: The ID of the workspace where the collection will be created.
        :param collection_name: The name of the collection to be created.
        """
        database_type = request.data.get("database_type")
        workspace_id = request.GET.get("workspace_id")

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        serializer = CreateCollectionSerializer(data=request.data)

        if not serializer.is_valid():
            return CustomResponse(
                False,
                "Posting wrong data to API",
                serializer.errors,
                status.HTTP_400_BAD_REQUEST,
            )
        all_responses = []

        for types in database_type:
            if types == "META_DATA":
                database = f"{workspace_id}_DB_0"
                collection_names = [
                    f"{workspace_id}_templates_metadata_collection_0",
                    f"{workspace_id}_documents_metadata_collection_0",
                    f"{workspace_id}_clones_metadata_collection_0",
                ]
            elif types == "DATA":
                database = f"{workspace_id}_DB_0"
                collection_names = [
                    f"{workspace_id}_template_collection_0",
                    f"{workspace_id}_document_collection_0",
                    f"{workspace_id}_process_collection",
                    f"{workspace_id}_clone_collection_0",
                    f"{workspace_id}_workflow_collection_0",
                    f"{workspace_id}_folder_collection_0",
                ]

            dc_connect = DatacubeConnection(
                api_key=api_key, workspace_id=workspace_id, database=database
            )

            for collection_name in collection_names:
                response = dc_connect.add_collection_to_database(collection_name)
                all_responses.append(response)
        # print(all_responses)
        for responses in all_responses:
            if not responses["success"]:
                return CustomResponse(
                    False,
                    "Failed to create collection, kindly contact the administrator.",
                    None,
                    status.HTTP_400_BAD_REQUEST,
                )

        return CustomResponse(
            True, "Collection has been created successfully", None, status.HTTP_200_OK
        )

    def check_metadata_database_status(self, request):
        """
        Check the existence of the metadata database.

        This method checks if the specified databases (meta data and data) are available for a given workspace.

        :param request: The HTTP request object.
        :param api_key: The API key for authorization.
        :param workspace_id: The ID of the workspace.
        """
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        meta_data_database = f"{workspace_id}_DB_0"
        # #print(meta_data_database)
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=meta_data_database
        )
        response_meta_data = dc_connect.datacube_collection_retrieval()
        # #print(response_meta_data)

        if not response_meta_data["success"]:
            return CustomResponse(
                False,
                "Meta-Data is not yet available, kindly contact the administrator.",
                None,
                status.HTTP_501_NOT_IMPLEMENTED,
            )

        list_of_meta_data_collection = [
            f"{workspace_id}_templates_metadata_collection_0",
            f"{workspace_id}_documents_metadata_collection_0",
            f"{workspace_id}_clones_metadata_collection_0",
        ]

        missing_collections = []
        for collection in list_of_meta_data_collection:
            if collection not in response_meta_data["data"][0]:
                missing_collections.append(collection)

        if missing_collections:
            missing_collections_str = ", ".join(missing_collections)
            self.create_collection(request)
            return CustomResponse(
                False,
                f"The following collections are missing: {missing_collections_str}",
                missing_collections,
                status.HTTP_404_NOT_FOUND,
            )

        return CustomResponse(True, "Meta-Data are available to be used", None, status.HTTP_200_OK)

    def check_data_database_status(self, request):
        """
        Check the existence of the data database.

        This method checks if the specified databases (meta data and data) are available for a given workspace.

        :param request: The HTTP request object.
        :param api_key: The API key for authorization.
        :param workspace_id: The ID of the workspace.
        """
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")

        datas = [
            f"{workspace_id}_process_collection",
            f"{workspace_id}_document_collection_0",
            f"{workspace_id}_workflow_collection_0",
            f"{workspace_id}_template_collection_0",
            f"{workspace_id}_clone_collection_0",
            f"{workspace_id}_folder_collection_0",
        ]

        data_database = f"{workspace_id}_DB_0"
        ready_collection = []

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=data_database
        )
        response_data = dc_connect.datacube_collection_retrieval()
        # datas=response_data['data'][0]
        # print(datas)

        if response_data["success"]:
            ready_collection.append(response_data["data"][0])

            if not response_data["success"]:
                return CustomResponse(
                    False,
                    "Database is not yet available, kindly contact the administrator",
                    None,
                    status.HTTP_501_NOT_IMPLEMENTED,
                )

        missing_collections = []

        for collection in datas:
            if collection not in response_data["data"][0]:
                missing_collections.append(collection)

        if missing_collections:
            missing_collections_str = ", ".join(missing_collections)
            return CustomResponse(
                False,
                f"The following collections are missing: {missing_collections_str}",
                missing_collections,
                status.HTTP_404_NOT_FOUND,
            )

        return CustomResponse(True, "Databases are available to be used", None, status.HTTP_200_OK)

    def handle_error(self, request):
        """
        Handle invalid request type.
        This method is called when the requested type is not recognized or supported.

        :param request: The HTTP request object.
        :type request: HttpRequest
        :return: Response indicating failure due to an invalid request type.
        :rtype: Response
        """
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class NewTemplate(APIView):

    def get(self, request):

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        workspace_id = request.GET.get("workspace_id")
        template_id = request.GET.get("template_id")
        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_template_collection_0"
        filters = {"_id": template_id}
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )
        res = dc_connect.get_templates_from_collection(filters, single=True)
        if res["success"]:
            return Response(res)
        else:
            return CustomResponse(False, res["message"], None, status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        type_request = request.GET.get("type")
        workspace_id = request.data.get("workspace_id")

        if type_request == "approve":
            return self.approve(request)

        data = ""
        page = ""
        folder = []
        approved = False
        db_name = f"{workspace_id}_DB_0"
        metadata_db = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(request.data["company_id"]):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )
        collection_name = dc_connect.collection_names.get("template")
        metadata_collection = dc_connect.collection_names.get("template_metadata")

        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]
            viewers = [{"member": request.data["created_by"], "portfolio": portfolio}]
            organization_id = request.data["company_id"]
            template_data = {
                "template_name": "Untitled Template",
                "content": data,
                "page": page,
                "folders": folder,
                "created_by": request.data["created_by"],
                "company_id": organization_id,
                "data_type": request.data["data_type"],
                "template_type": "draft",
                "auth_viewers": viewers,
                "message": "",
                "approval": approved,
                "collection_name": collection_name,
                "DB_name": db_name,
            }

            res = dc_connect.post_data_to_collection(
                collection=collection_name,
                operation="insert",
                data=template_data,
            )
            if res["success"]:
                collection_id = res["data"]["inserted_id"]
                res_metadata = dc_connect.save_to_metadata(
                    metadata_collection,
                    {
                        "template_name": "Untitled Template",
                        "created_by": request.data["created_by"],
                        "collection_id": collection_id,
                        "data_type": request.data["data_type"],
                        "company_id": organization_id,
                        "auth_viewers": viewers,
                        "template_state": "draft",
                        "approval": False,
                    },
                    database=metadata_db,
                )
                if not res_metadata["success"]:
                    try:
                        create_new_collection_for_template = dc_connect.add_collection_to_database(
                            database=db_name,
                            collections=metadata_collection,
                        )
                        return CustomResponse(
                            True,
                            "collection created successfully",
                            None,
                            status.HTTP_201_CREATED,
                        )
                    except:

                        return CustomResponse(
                            False,
                            "An error occured while trying to save document metadata",
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

        form = request.data
        if not form:
            return Response("Data is needed", status.HTTP_400_BAD_REQUEST)
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        workspace_id = request.GET.get("workspace_id")

        database = f"{workspace_id}_DB_0"
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )

        collection = dc_connect.collection_names.get("template")
        meta_data_collection = dc_connect.collection_names.get("template_metadata")

        update_data = {"approval": True}
        collection_id = form["collection_id"]
        metadata_id = form["metadata_id"]
        query = {"_id": collection_id}
        query_metadata = {"_id": metadata_id}

        approval_update = dc_connect.post_data_to_collection(
            collection, update_data, "update", query
        )
        metadata_approval_update = dc_connect.post_data_to_collection(
            meta_data_collection, update_data, "update", query_metadata
        )

        if approval_update and metadata_approval_update:
            return CustomResponse(True, "Template approved", None, status.HTTP_200_OK)
        else:
            return CustomResponse(
                False, "Template approval failed", None, status.HTTP_400_BAD_REQUEST
            )


class ApprovedTemplates(APIView):
    def get(self, request, *args, **kwargs):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        database = f"{workspace_id}_DB_0"
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )
        filters = {"approval": True}
        res = dc_connect.get_templates_from_collection(filters)
        if res["success"]:
            return Response(res)
        else:
            return CustomResponse(False, res["message"], None, status.HTTP_400_BAD_REQUEST)


class Workflow(APIView):
    def get(self, request):
        """Get Workflows Created in a collection"""
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        db_name = f"{workspace_id}_DB_0"
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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
        form = request.data
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not form:
            return Response("Workflow Data required", status.HTTP_400_BAD_REQUEST)

        workspace_id = request.GET.get("workspace_id")
        db_name = f"{workspace_id}_DB_0"
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        organization_id = form["company_id"]
        data = {
            "workflow_title": form["wf_title"],
            "steps": form["steps"],
        }
        collection_name = dc_connect.collection_names.get("workflow")
        """ workflow_unique_name = generate_unique_collection_name(
            collection_name, "workflow_collection"""

        # if workflow_unique_name["success"]:

        res = dc_connect.save_to_workflow_collection(
            collection_name,
            {
                "workflows": data,
                "company_id": organization_id,
                "created_by": form["created_by"],
                "portfolio": form["portfolio"],
                "data_type": form["data_type"],
                "workflow_type": "original",
            },
        )
        if res["success"]:
            return Response(
                {
                    "_id": res["data"]["inserted_id"],
                    "workflows": data,
                    "created_by": form["created_by"],
                    "company_id": form["company_id"],
                    "workflow_type": "original",
                    "data_type": form["data_type"],
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
        form = request.data
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not form:
            return CustomResponse(
                False, "Workflow Data is required", None, status.HTTP_400_BAD_REQUEST
            )
        workspace_id = request.GET.get("workspace_id")
        workflow_id = form["workflow_id"]
        query = {"_id": workflow_id}
        database = f"{workspace_id}_DB_0"
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=database
        )
        collection = dc_connect.collection_names.get("workflow")
        update_data = form["workflow_update"]
        update_workflow = dc_connect.post_data_to_collection(
            collection, update_data, "update", query
        )
        # print(update_workflow)
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

        db_name_0 = f"{workspace_id}_DB_0"
        # metadata_db = f"{workspace_id}_DB_0"
        db_name_1 = f"{workspace_id}_TEMPLATE_DB_1"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name_0
        )

        collection_name = dc_connect.collection_names.get("template")
        metadata_collection = dc_connect.collection_names.get("template_metadata")

        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]
        viewers = [{"member": created_by, "portfolio": portfolio}]

        if not workspace_id or not created_by or not data_type:
            return CustomResponse(
                False,
                "workspace_id, created_by and data_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        # TODO: This checks the collection existence in only one db. Will not pass database arg
        collection = dc_connect.check_if_name_exists_collection(collection_name)

        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        template = dc_connect.get_templates_from_collection({"_id": template_id}, single=True)

        if not template["data"]:
            return CustomResponse(False, "No template found", None, status.HTTP_404_NOT_FOUND)

        isapproved = template["data"][0].get("approval")

        if not isapproved:
            return CustomResponse(
                False, "Template is not approved", None, status.HTTP_403_FORBIDDEN
            )

        document_data = {
            "document_name": "Untitled Document",
            "content": template["data"][0].get("content"),
            "created_by": request.data["created_by"],
            "company_id": organization_id,
            "page": template["data"][0]["page"],
            "data_type": request.data["data_type"],
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "original",
            "collection_name": collection_name,
            "process_id": "",
            "folders": [],
            "template": db_name_0,
        }

        db_0_res = dc_connect.post_data_to_collection(
            collection=collection_name,
            operation="insert",
            data=document_data,
        )

        if not db_0_res["success"]:
            return CustomResponse(
                False,
                "An error occured while trying to save document",
                None,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        res = dc_connect.post_data_to_collection(
            collection=collection_name,
            operation="insert",
            data=document_data,
            # using a different db here
            database=db_name_1,
        )

        if res["success"]:
            collection_id = res["data"]["inserted_id"]
            # metadata_db same as db_name_0 so will use instance as is
            metadata = dc_connect.save_to_metadata(
                metadata_collection,
                # metadata_db,
                {
                    "document_name": "Untitled Document",
                    "created_by": request.data["created_by"],
                    "collection_id": collection_id,
                    "data_type": request.data["data_type"],
                    "company_id": organization_id,
                    "auth_viewers": viewers,
                    "document_state": "draft",
                },
            )
            res_metadata = dc_connect.save_to_metadata(
                collection_id=collection_name,
                data=metadata,
                # will use different db here
                database=db_name_1,
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

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        # TODO change this or find out why
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

        collection_name = collection["name"]

        if member and portfolio:
            auth_viewers = [{"member": member, "portfolio": portfolio}]

            # TODO compare
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
                # TODO compare
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
                    # TODO compare
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

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

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
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        collection_name = collection["name"]

        if not validate_id(item_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        if document_type == "document":
            # TODO compare
            document = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)

        elif document_type == "clone":
            # TODO compare
            document = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)

        if document:
            portfolio = request.query_params.get("portfolio", "")

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

        db_name = f"{workspace_id}_DB_0"
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
            # document = dc_connect.get_documents_from_collection({"_id": item_id}, single=True)
            document = dc_connect.get_templates_from_collection({"_id": item_id}, single=True)
            return Response(document["data"], status.HTTP_200_OK)

        if document_type == "clone":
            # document = dc_connect.get_clones_from_collection({"_id": item_id}, single=True)
            document = dc_connect.get_templates_from_collection({"_id": item_id}, single=True)
            return Response(document["data"], status.HTTP_200_OK)

        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)


class ItemContent(APIView):
    def get(self, request, item_id):
        """Content map of a given document or a template or a clone"""
        # TODO fix. This doesn't work. Unable to get content for the content field
        content = []
        item_type = request.query_params.get("item_type")
        workspace_id = request.query_params.get("workspace_id")
        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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
                # dc_connect.get_documents_from_collection({"_id": item_id}, single=True)["data"][0]["content"]
                dc_connect.get_templates_from_collection({"_id": item_id}, single=True)["data"][0][
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


class FinalizeOrRejectEducation(APIView):
    def post(self, request, collection_id):
        """After access is granted and the user has made changes on a document."""
        if not validate_id(collection_id):
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

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
        database = f"{workspace_id}_DB_0"

        # TODO compare; Why was PROCESS_DB_0 used?
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

        # res = FinalizeOrReject().get(request, process_id)
        # TODO why was this done?
        res = FinalizeOrReject().post(request, process_id, payload=payload)

        # if res.status_code == 200:
        process = dc_connect.get_processes_from_collection(
            database=database, filters={"_id": process_id}
        )["data"]
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
        database = f"{workspace_id}_DB_0"

        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)

        # TODO compare; Why was PROCESS_DB_0 used?
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=None, database=database)

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
        database = f"{workspace_id}_DB_0"

        # TODO compare; Why was PROCESS_DB_0 used?
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=None, database=database)

        if not all[folder_name, created_by, company_id, data_type]:
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
        database = f"{workspace_id}_DB_0"

        # TODO compare; Why was PROCESS_DB_0 used?
        dc_connect = DatacubeConnection(api_key=api_key, workspace_id=None, database=database)

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
        database = f"{workspace_id}_DB_0"
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
        collection = dc_connect.collection_names["process"]
        process = datacube_processing.DataCubeProcess(
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
            verification_links = datacube_processing.DataCubeHandleProcess(
                data, dc_connect=dc_connect
            ).start()
            return Response(verification_links, status.HTTP_200_OK)


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

        db_name = f"{workspace_id}_DB_0"
        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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
            process_list = None
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

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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
            # TODO compare
            document = dc_connect.get_documents_from_collection({"_id": parent_id}, single=True)[
                "data"
            ]
            if document:
                document_name = document[0]["document_name"]
                process.update({"document_name": document_name})

            # TODO compare; also need single arg?
            links = dc_connect.get_links_from_collection(
                filters={"process_id": process["_id"]},
            )["data"]

            if links:
                # TODO confirm
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

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        if not request.data:
            return Response("Some parameters are missing", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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

        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_process_collection"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        # only one link as opposed to links in views_v2
        # link_object = dc_connect.get_links_from_collection(
        link_object = dc_connect.get_documents_from_collection(
            filters={"process_id": process_id}, single=True
        )["data"]

        if not link_object:
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

        # TODO confirm
        process_steps = process[0].get("process_steps")
        for step in process_steps:
            step_clone_map = step.get("stepDocumentCloneMap")
            # TODO what do we do with this?
            step_role = step.get("stepRole")
            state = check_all_accessed(step_clone_map)
            if state:
                pass
            else:
                link = link_object[0]["link"]
                return Response(link, status.HTTP_200_OK)
        return Response("user is not part of this process", status.HTTP_401_UNAUTHORIZED)


class ProcessVerification(APIView):
    def post(self, request, process_id):
        """verification of a process step access and checks that duplicate document based on a step."""

        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        user_type = request.data["user_type"]
        auth_user = request.data["auth_username"]
        auth_role = request.data["auth_role"]
        auth_portfolio = request.data["auth_portfolio"]
        token = request.data["token"]
        org_name = request.data["org_name"]
        collection_id = None
        # only one link as opposed to links in views_v2
        # TODO compare
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
        # TODO if the process_id used is from link object why are we passing process_id in the url path?
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
                            # TODO why are we over writing the one gotten from request.data?
                            # TODO Do we break after getting a collection_id?
                            collection_id = item.get(auth_user[0])

        # Get previous and next users/viewers
        prev_viewers, next_viewers = get_prev_and_next_users(
            process, auth_user, auth_role, user_type
        )
        user_email = request.data.get("user_email") if request.data.get("user_email") else ""
        process["org_name"] = org_name
        handler = datacube_processing.DataCubeHandleProcess(process, dc_connect=dc_connect)
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

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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
            verification_links = datacube_processing.DataCubeHandleProcess(
                process, api_key=api_key, database=db_name, workspace_id=workspace_id
            ).start()
            if verification_links:
                return Response(verification_links, status.HTTP_200_OK)
            else:
                return Response(
                    f"The process is already in {state} state",
                    status.HTTP_200_OK,
                )
        # TODO Potential error: what is supposed to happen if neither conditions are met?


class ProcessImport(APIView):
    def post(self, request, process_id):
        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
        )

        data = request.data
        company_id = data.get("company_id")
        portfolio = data.get("portfolio")
        member = data.get("member")
        data_type = data.get("data_type")
        # TODO confirm
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
            api_key,
            db_name,
            f"{workspace_id}_templates_metadata_collection_0",
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
            dc_connect.collection_names["workflow"],
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

        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        dc_connect = DatacubeConnection(
            api_key=api_key, workspace_id=workspace_id, database=db_name
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
