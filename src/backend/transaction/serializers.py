from django.forms import ValidationError
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
    category = serializers.CharField()
    store = serializers.StringRelatedField(read_only=True)
    profile = serializers.StringRelatedField(read_only=True) 
    group = serializers.StringRelatedField(read_only=True)
    

    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):            #podesio create da se moze poslat categoryID samo i da se profil veze na profil s kojega se salje request
        category_id = validated_data.pop('category', None)
        if category_id:
            try:
                category = Category.objects.get(pk =category_id)
            except Category.DoesNotExist:
                raise ValidationError("Category doesn't exist")
        validated_data['profile'] = self.context['profile']
        return Transaction.objects.create(category=category, **validated_data)

     

class ExpenseSerializer(serializers.ModelSerializer):
    profile = serializers.StringRelatedField(read_only=True)
    category = serializers.CharField()
    class Meta:
        model = Expense
        fields = '__all__'
    def create(self, validated_data):     #promjenjeno tako da se dohvacaju samo kategory koje smo naveli
        category_id = validated_data.pop('category', None)
        if category_id:
            try:
                category = Category.objects.get(pk = category_id)
            except Category.DoesNotExist:
                raise ValidationError("Category doesn't exist")
        validated_data['profile'] = self.context['profile'] #dodavamo profil u koji je ulogiran user
        return Expense.objects.create(category=category, **validated_data)

    # Treba dodat i update funkciju u slucaju kad user zeli promjenit postojeci expense
    def update(self, instance, validated_data):
        category_id = validated_data.pop('category', None)
        if category_id:
            try:
                category = Category.objects.get(pk=category_id)
                instance.category = category
            except Category.DoesNotExist:
                raise ValidationError("Category doesn't exist")

        # Update ostala polja
        instance.amount = validated_data.get('amount', instance.amount)
        instance.expenseName = validated_data.get('expenseName', instance.expenseName)
        instance.expenseNote = validated_data.get('expenseNote', instance.expenseNote)
        instance.save()
        return instance