from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('google/', views.google_auth, name='google_auth'),
    path('authorize/', views.authorize, name='google_authorize'),
    path('callback/', views.google_callback, name='google_callback'),
    path('profile_setup/', views.profile_setup, name='profile_setup'),
    path('create_group/', views.create_group, name='create_group'),
    path('join_group/', views.join_group, name='join_group'),
    path('leave_group/', views.leave_group, name='leave_group'),
]
