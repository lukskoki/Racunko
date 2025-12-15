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
    path('get_group/', views.get_group,name='get_group'),
    path('get_all_groups/', views.get_all_groups, name='get_all_groups'),
    path('get_members/', views.get_members, name='get_members'),
    path('change_group_budget/', views.change_group_budget, name='change_group_budget'),
]
