from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from .models import Transaction, Category
from user.models import Profile
from rest_framework.response import Response
import base64
from .utils.ai_client import extract_category

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
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def categorize_receipt(request):
    # Ocekuje base64 encoded sliku racuna u JSON body-u

    base64_image = request.data.get("image")

    if not base64_image:
        return Response({
            'error': 'Missing image field in request body'
        }, status=400)

    categories = Category.objects.all()
    categories_data = CategorySerializer(categories, many=True).data # Pretvorimo u json da mozemo poslati AI-u


    try:
        ai_result = extract_category(base64_image, categories_data)

        category = Category.objects.get(categoryName=ai_result['category'])

        return Response({
            'message': 'Success',
            'amount': ai_result['amount'],
            'category_id': category.id, # Vratimo informaciju frontendu
            'category_name': category.categoryName,
            'available_categories': categories_data # Vratimo i sve kategorije koje postoje da ih u frontendu mozemo prikazat
        }, status = 200)

    except Category.DoesNotExist:
        return Response({
            'error': f"AI je vratio nepostojecu kategoriju: {ai_result['category']}"
        }, status = 400)

    except Exception as e:
        return Response({
            'error': f"Greska pri kategorizaciji: {str(e)}"
        }, status = 400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses(request):
    profile = request.user.profile
    expenses = profile.expenses.all()
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    profile = request.user.profile
    expense_data = {
        'amount' : request.data.get('amount'),
        'category' : request.data.get('category'),
        'expenseName': request.data.get('expenseName')
    }
    serializer = ExpenseSerializer(data= expense_data, context={'profile': profile})  #predavamo data i profile
        
    if serializer.is_valid():
        expense = serializer.save()   #pravimo expense
    else:
        return Response(serializer.errors, status=400) #ako ne uspije serializer
    return Response(ExpenseSerializer(expense).data, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request, expense_id):
    profile = request.user.profile
    try:
        expense = Expense.objects.get(id=expense_id, profile=profile)
    except Exception as e:
        return Response({"detail": e}, status=404)
    expense.delete()
    return Response("Object deleted successfully", status=204)


