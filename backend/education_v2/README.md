NewTemplate:
- URL: education/templates/
- GET (get one template):
    - query_params:
        - workspace_id
        - template_id
- POST (create a new template):
    - query_params:
        - type
    
    - request_body:
        - workspace_id
        - company_id
        - portfolio
        - created_by
        - data_type
        - collection_id (if type is "approve")
        - metadata_id (if type is "approve")


ApprovedTemplates:
- URL: education/templates/approved/
- GET (get approved templates):
    - query_params:
        - workspace_id


Workflow:
- URL: education/workflows/
- GET (get workflows created in a collection):
    - query_params:
        - workspace_id

- POST (create a new workflow):
    - query_params:
        - workspace_id
    - request_body:
        - company_id
        - wf_title
        - steps
        - created_by
        - portfolio
        - data_type

- PUT (update a workflow):
    - query_params:
        - workspace_id
    - request_body:
        - workflow_id
        - workflow_update

CollectionData:
- URL: education/collections/
- POST (get data from a collection):
    - request_body:
        - api_key
        - db_name
        - coll_name
        - filters
        - limit (optional)
        - offset (optional)


NewDocument:
- URL: education/documents/
- POST (create a new document):
    - request_body:
        - workspace_id
        - company_id
        - created_by
        - data_type
        - template_id
        - portfolio (optional)
        

Document:
- URL: education/documents/<str:company_id>/list/
- GET (list of created documents):
    - path_params:
        - company_id
    - query_params:
        - workspace_id
        - data_type
        - document_type
        - document_state
        - member (optional)
        - portfolio (optional)
        


DocumentLink:
- URL: education/documents/<str:item_id>/link/
- GET (editor link for a document):
    - path_params:
        - item_id
    - query_params:
        - workspace_id
        - document_type
        - portfolio (optional)
        


DocumentDetail:
- URL: education/documents/<str:item_id>/detail/
- GET (retrieves the document object for a specific document):
    - path_params:
        - item_id
    - query_params:
        - workspace_id
        - document_type
        


ItemContent:
- URL: education/content/<str:item_id>/
- GET (content map of a given document or a template or a clone):
    - path_params:
        - item_id
    - query_params:
        - item_type
        - workspace_id
        


FinalizeOrRejectEducation:
- URL: education/processes/<str:collection_id>/finalize-or-reject/
- POST (after access is granted and the user has made changes on a document):
    - path_params:
        - collection_id
    - request_body:
        - api_key
        - workspace_id
        - coll_name
        - item_id
        - item_type
        - role
        - authorized
        - user_type
        - action
        - message (optional)
        - link_id (optional)
        - product (optional)
        


Folders:
- URL: education/folders/list/
- GET (retrieve a list of folders):
    - query_params:
        - data_type
        - company_id
        

- POST (create a new folder):
    - request_body:
        - folder_name
        - created_by
        - company_id
        - data_type
        


FolderDetail:
- URL: education/folders/<str:folder_id>/detail
- GET (retrieve the details of a specific folder):
    - path_params:
        - folder_id
        


DocumentOrTemplateProcessing:
- URL: education/processes/
- POST (processing is determined by action picked by user):
    - query_params:
        - workspace_id
    - request_body:
        - api_key
        - company_id
        - workflows
        - created_by
        - creator_portfolio
        - process_type
        - org_name
        - workflows_ids
        - parent_id
        - data_type
        - process_title
        - email (optional)
        - action
        - process_id (optional)
        

Process:
- URL: education/processes/<str:company_id>/list/
- GET (retrieve a list of processes or a specific process state):
    - path_params:
        - company_id
    - query_params:
        - workspace_id
        - data_type
        - process_state (optional)
        - page (optional)
        


ProcessDetail:
- URL: education/processes/<str:process_id>/detail/
- GET (retrieve a specific process by process id):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
        - data_type
        

- PUT (update a specific process):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
        - data_type
    - request_body:
        - workflows
        - step_id
        


ProcessLink:
- URL: education/processes/<str:process_id>/link/
- POST (get a link process for person having notifications):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
        - data_type
    - request_body:
        - user_name
        


ProcessVerification:
- URL: education/processes/<str:process_id>/verify/
- POST (verification of a process step access and checks that duplicate document based on a step):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
        - data_type
    - request_body:
        - user_type
        - auth_username
        - auth_role
        - auth_portfolio
        - token
        - org_name
        - collection_id (optional)
        - user_email (optional)
        - city
        - country
        - continent
        



TriggerProcess:
- URL: education/processes/<str:process_id>/trigger/
- POST (get process and begin processing it):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
        - data_type
    - request_body:
        - user_name
        - action
        


ProcessImport:
- URL: education/processes/<str:process_id>/import/
- POST (import a process):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
        - data_type
    - request_body:
        - company_id
        - portfolio
        - member
        - data_type
        - user_email (optional)
        


ProcessCopies:
- URL: education/processes/<str:process_id>/copies/
- POST (create a copy of a process):
    - path_params:
        - process_id
    - query_params:
        - workspace_id
    - request_body:
        - created_by
        - portfolio
        

