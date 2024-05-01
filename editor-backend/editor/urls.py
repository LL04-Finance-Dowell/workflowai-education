from django.urls import path
from .views import *

urlpatterns = [
    path("", HealthCheck.as_view()),
    path("server/", DeploymentWebhook.as_view()),
    path("get-data-by-collection/", GetAllDataByCollection.as_view()),
    path("get-data-from-collection/", GetAllDataFromCollection.as_view()),
    path("generate-editor-link/", GenerateEditorLink.as_view()),
    path("save-data-into-collection/", SaveIntoCollection.as_view()),
    path("save-data-into-collection-with-version/", SaveIntoCollectionWithVersion.as_view()),
    path("generate-pdf-link/", GeneratePDFLink.as_view()),
]
