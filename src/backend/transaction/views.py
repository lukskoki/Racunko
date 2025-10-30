from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ExpenseSerializer
from .models import Expense
from backend.user.models import Profile
from rest_framework.response import Response


