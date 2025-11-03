from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from transaction.serializers import ExpenseSerializer
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile
from django.contrib.auth import authenticate, get_user_model
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope
import requests as http
from django.conf import settings
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

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


@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    code = request.data.get("code")
    id_tok_direct = request.data.get("id_token")

    if not code and not id_tok_direct:
        return Response({"detail": "Missing 'code' or 'id_token'."}, status=status.HTTP_400_BAD_REQUEST)

    
    try:
        if id_tok_direct:
            idinfo = google_id_token.verify_oauth2_token(
                id_tok_direct, google_requests.Request(), settings.GOOGLE_WEB_CLIENT_ID
            )
        else:
            data = {
                "code": code,
                "client_id": settings.GOOGLE_WEB_CLIENT_ID,
                "client_secret": settings.GOOGLE_WEB_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,  # "postmessage"
                "grant_type": "authorization_code",
            }
            r = http.post("https://oauth2.googleapis.com/token", data=data, timeout=10)
            if r.status_code != 200:
                return Response({"detail": "Token exchange failed", "google": r.json()}, status=status.HTTP_400_BAD_REQUEST)

            tok = r.json()
            id_tok = tok.get("id_token")
            if not id_tok:
                return Response({"detail": "No id_token from Google"}, status=status.HTTP_400_BAD_REQUEST)

            idinfo = google_id_token.verify_oauth2_token(
                id_tok, google_requests.Request(), settings.GOOGLE_WEB_CLIENT_ID
            )
    except Exception as e:
        return Response({"detail": f"Invalid id_token: {e}"}, status=status.HTTP_400_BAD_REQUEST)

    
    email = idinfo.get("email")
    name = idinfo.get("name") or ""
    if not email:
        return Response({"detail": "Google token has no email"}, status=status.HTTP_400_BAD_REQUEST)

    User = get_user_model()
    base_username = (email.split("@")[0] or "user").lower()
    username = base_username
    i = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{i}"
        i += 1

    user, _ = User.objects.get_or_create(
        email=email,
        defaults={"username": username, "first_name": name.split(" ")[0] if name else ""},
    )
    # osigura da postoji i Profile kao u register-u
    Profile.objects.get_or_create(user=user, defaults={"role": "user", "isAdmin": False})

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "email": email, "name": name}, status=status.HTTP_200_OK)


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
def profile_setup(request):
    profile = request.user.profile  #dohvacamoo profil koji je povezan s ulogiranim userom
    expenses_data = request.data.get('expenses', [])    #dohvacamo polje expense-a (Kredit, Auto...)
    
    profile_data = {
        'income' : request.data.get('income'),
        'notifications' : request.data.get('notifications'),
        'income_date' : request.data.get('income_date')
    }

    #profile je vec napravljen kad se User napravi, sad samo nadopounjavamo podatke
    profile_serializer = ProfileSerializer(profile, data = profile_data, partial=True)

    if profile_serializer.is_valid():
        profile_serializer.save()     #updajtamo profil
    else: 
        return Response(profile_serializer.errors, status=400)

    created_expenses = []  #ovdje stavljamo sve koje su uspjesno napravljene

    for expense_data in expenses_data:
        serializer = ExpenseSerializer(data= expense_data, context={'profile': profile})  #predavamo data i profile
        
        if serializer.is_valid():
            expense = serializer.save()   #pravimo expense
            created_expenses.append(expense)
        else:
            return Response(serializer.errors, status=400) #ako ne uspije serializer
    
    return Response({
        "profile": profile_serializer.data,             
        "expenses":ExpenseSerializer(created_expenses,many=True).data
    }, status=201)

