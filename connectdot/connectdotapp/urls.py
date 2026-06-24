from django.urls import path
from . import views
from .views import api_home

urlpatterns = [
    path('', api_home),
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('enroll/', views.enroll_course),
    path('apply-job/', views.apply_job),
]