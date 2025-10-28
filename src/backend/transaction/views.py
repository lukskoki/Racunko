from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ExpenseSerializer
from .models import Expense
from backend.user.models import Profile
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([IsAuthenticated]) #samo ulogirani
def profile_setup_expenses(request):
    profile = request.user.profile
    serializer = ExpenseSerializer(data= request.data, partial = True, context = {'profile': profile}) #sendamo profile kao nas u koji smo ulogirani
    if serializer.is_valid():
        expense =serializer.save()      #zovemo create funkciju u serializeru
        return Response(ExpenseSerializer(expense).data, status =201)     #vracamo status 201 da je uspjesno i podatku u JSON obliku
    return Response(serializer.errors, status=400)
