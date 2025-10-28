from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile
from django.contrib.auth import authenticate
@api_view(['POST'])
@permission_classes([AllowAny])  # Dopusti bilo kome da se registrira
def register(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid(): # Provjera dal su svi podaci dobri
        # Kreiraj usera 
        user = serializer.save()

        # Kreiraj token za usera, ovo koristimo za autentikaciju u buducim requestovima
        token, created = Token.objects.get_or_create(user=user)

        # Kreiraj prazan profile za usera pa cemo ga kasnije updateat
        Profile.objects.create(
            user=user,
            role=request.data.get('role', 'user'),  # Default role
            isAdmin=False
        )

        return Response({
            'token': token.key, # Ovo cemo onda spremit u frontendu i koristit za buduce requests
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])  # Dopusti bilo kome da se ulogira
def login(request):
    # Izvucemo username i password iz requesta
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username i password ne smiju bit prazni"},
            status = status.HTTP_400_BAD_REQUEST
        )
    
    # Provjerimo dal user postoji
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Neispravni podaci"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Dobimo token za usera
    token, created = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key, # Ovo spremimo na frontendu
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])  # samo ulogirani korisnici
def profile_setup_income(request):
    profile = request.user.profile
    serializer = ProfileSerializer(profile, data = request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Setup 1 success', 'profile': serializer.data})
    return Response(serializer.errors, status=400)

