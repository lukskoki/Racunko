from rest_framework import serializers
from .models import Category, Store, Transaction, Expense

class categorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class storeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'

class transactionSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField( read_only = True)
    store = serializers.StringRelatedField(read_only = True)
    username = serializers.StringRelatedField(read_only = True)
    group = serializers.StringRelatedField(read_only = True)

    class Meta:
        model =Transaction
        fields = '__all__'
        extra_kwargs = {
            'transactionID' : {'read_only': True}
        }

class expenseSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Expense
        fields = '__all__'
        extra_kwargs={
            'expenseID' :{'read_only' :True}
        }