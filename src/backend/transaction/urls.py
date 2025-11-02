from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path('manual_create_transaction/', views.manual_create_transaction, name='manual_create_transaction')
]