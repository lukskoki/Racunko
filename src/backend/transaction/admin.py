from django.contrib import admin
from .models import Category, Store, Transaction, Expense
# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'categoryName')
    search_fields = ('categoryName',)
    ordering = ('id',)