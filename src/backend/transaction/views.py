from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TransactionSerializer, CategorySerializer
from .models import Transaction, Category
from user.models import Profile
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manual_create_transaction(request):
    profile = request.user.profile

    transaction_data = {
        'amount' : request.data.get('amount'),
        'category' : request.data.get('category'),
        'date' : request.data.get('date')
    }
    
    serializer = TransactionSerializer(data = transaction_data, context= {'profile' : profile})

    if serializer.is_valid():
        transaction = serializer.save()
        return Response(TransactionSerializer(transaction).data, status=201)
    else :
        return Response(serializer.errors, status=400)
