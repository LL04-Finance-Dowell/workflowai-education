from django.urls import path
from education_v2 import views


urlpatterns = [
    path("education/", views.HomeView.as_view()),
    
    
]
