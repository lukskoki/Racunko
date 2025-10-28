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
    category = serializers.CharField()
    class Meta:
        model = Expense
        fields = '__all__'
    def create(self, validated_data):     #dodano da se automatski rade kateogrije ako se posalje samo ime kategorije kao u profile create
        category_name = validated_data.pop('category', None)
        if category_name:
            category_obj, _ignore = Category.objects.get_or_create(categoryName=category_name)
            validated_data['category'] = category_obj

        validated_data['profile'] = self.context['profile'] #dodavamo profil u koji je ulogiran user
        return Expense.objects.create(**validated_data)