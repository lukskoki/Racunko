from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TransactionSerializer, CategorySerializer
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
    # Ocekuje sliku racuna

    if 'image' not in request.FILES:
        return Response(
            {'error': 'Slika nije uploadana'}, status = 400
        )
    
    image_file = request.FILES['image']

    allowed_types=['image/jpeg', 'image/jpg', 'image/png']

    if image_file.content_type not in allowed_types:
        return Response(
            {'error': f"Nepodrzan tip slike"}, status=400
        )

    categories = Category.objects.all()
    categories_data = CategorySerializer(categories, many=True).data # Pretvorimo u json da mozemo poslati AI-u


    base64_image = base64.b64encode(image_file.read()).decode('utf-8') # Pretvorimo sliku u base64 da mozemo poslat prema OpenAI

    
    try:
        ai_result = extract_category(base64_image, categories_data)

        category = Category.objects.get(categoryName=ai_result['category'])

        return Response({
            'message': 'Success',
            'amount': ai_result['amount'],
            'cateory_id': category.id, # Vratimo informaciju frontendu
            'category_name': category.categoryName
        }, status = 200)

    except Category.DoesNotExist:
        return Response({
            'error': f"AI je vratio nepostojecu kategoriju: {ai_result['category']}"
        }, status = 400)
    
    except Exception as e:
        return Response({
            'error': f"Greska pri kategorizaciji: {str(e)}"
        }, status = 400)



