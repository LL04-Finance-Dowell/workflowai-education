from django.urls import path
from education import views


urlpatterns = [
    path("education/", views.HomeView.as_view()),
    path("education/database/", views.DatabaseServices.as_view()),
    path("education/templates/", views.NewTemplate.as_view()),
    path("education/templates/<str:template_id>/detail/", views.TemplateDetail.as_view()),
    path("education/workflows/", views.Workflow.as_view()),

    path("education/collections/", views.CollectionData.as_view()),
    path("education/processes/", views.DocumentOrTemplateProcessing.as_view()),
    path(
        "education/processes/<str:collection_id>/finalize-or-reject/",
        views.FinalizeOrRejectEducation.as_view(),
    ),
    path("education/documents/", views.NewDocument.as_view()),
    path("education/documents/<str:item_id>/link/", views.DocumentLink.as_view()),
    path("education/documents/<str:item_id>/detail/", views.DocumentDetail.as_view()),
    path("education/documents/<str:company_id>/list/", views.Document.as_view()),
    path("education/folders/list/", views.Folders.as_view()),
    path("education/folders/<str:folder_id>/detail/", views.FolderDetail.as_view()),
    path("education/content/<str:item_id>/", views.ItemContent.as_view()),
    path(
        "education/processes/<str:company_id>/list/",
        views.Process.as_view(),
        name="process",
    ),
    path("education/processes/<str:process_id>/detail/", views.ProcessDetail.as_view()),
    path("education/processes/<str:process_id>/link/", views.ProcessLink.as_view()),
    path("education/processes/<str:token>/verify/", views.ProcessVerification.as_view(), name="verify_process"),
    path("education/processes/<str:process_id>/trigger/", views.TriggerProcess.as_view()),
    path("education/processes/<str:process_id>/import/", views.ProcessImport.as_view()),
    path("education/processes/<str:process_id>/copies/", views.ProcessCopies.as_view()),
    path("education/master-link/<str:link_id>/<str:token>/", views.MasterLink.as_view(), name="master_link"),
    path("education/public-ids/list/", views.ListPublicIds.as_view()),
    path("education/public-ids/", views.AddPublicIds.as_view()),
    
]
