from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path('manual_create_transaction/', views.manual_create_transaction, name='manual_create_transaction'),
    path('categorize_receipt/', views.categorize_receipt, name="categorize_receipt"),
    path('get_expenses/', views.get_expenses, name='get_expenses'),
    path('create_expense/', views.create_expense, name='create_expense'),
    path('delete_expense/<int:expense_id>/', views.delete_expense, name='delete_expense'),
]