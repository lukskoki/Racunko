from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
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
    path('change_user_allowance/', views.change_user_allowance, name='change_user_allowance'),
    path('get_member_spending/', views.get_member_spending, name='get_member_spending'),
    path('get_member_transactions/<int:user_id>/', views.get_member_transactions, name='get_member_transactions'),
    path('analytics/', views.analytics, name='analytics'),
    path('toggle_member_admin/<int:user_id>/', views.toggle_member_admin, name='toggle_member_admin'),
]
