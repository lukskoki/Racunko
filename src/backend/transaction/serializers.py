from rest_framework import serializers
from .models import Category, Store, Transaction, Expense


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(read_only=True)
    store = serializers.StringRelatedField(read_only=True)
    profile = serializers.StringRelatedField(read_only=True) 
    group = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    profile = serializers.StringRelatedField(read_only=True) 

    class Meta:
        model = Expense
        fields = '__all__'