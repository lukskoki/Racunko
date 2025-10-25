from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from .models import Profile


@api_view(['POST'])
@permission_classes([AllowAny])  # Dopusti bilo kome da se registrira
def register(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
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
