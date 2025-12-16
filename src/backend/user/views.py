from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from transaction.serializers import ExpenseSerializer
from .serializers import *
from .models import Profile
from django.contrib.auth import authenticate, get_user_model
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope
import requests as http
from django.conf import settings
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from urllib.parse import urlencode
from django.http import HttpResponse
import random
from django.shortcuts import get_object_or_404

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
            'user': UserSerializer(user).data  # Koristi serializer da vrati sve ukljucujuci profile_completed
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
            # redirect_uri mora biti isti kao u authorize view-u!
            base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')

            data = {
                "code": code,
                "client_id": settings.GOOGLE_WEB_CLIENT_ID,
                "client_secret": settings.GOOGLE_WEB_CLIENT_SECRET,
                "redirect_uri": f"{base_url}/api/auth/callback",
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

    # Vrati isti format kao i obican login
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data  # Koristi serializer da vrati sve ukljucujuci profile_completed
    }, status=status.HTTP_200_OK)


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
        'user': UserSerializer(user).data  # Koristi serializer da vrati sve ukljucujuci profile_completed
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])  # samo ulogirani korisnici
def profile_setup(request):
    profile = request.user.profile  #dohvacamoo profil koji je povezan s ulogiranim userom
    
    if profile.profile_completed is True: #gledamo da profile_setup nije vec napravljen
        return Response("profile setup is already completed", status=400)
    
    expenses_data = request.data.get('expenses', [])    #dohvacamo polje expense-a (Kredit, Auto...)
    
    profile_data = {
        'income' : request.data.get('income'),
        'notifications' : request.data.get('notifications'),
        'income_date' : request.data.get('income_date')
    }

    #profile je vec napravljen kad se User napravi, sad samo nadopounjavamo podatke
    profile_serializer = ProfileSerializer(profile, data = profile_data, partial=True)

    if profile_serializer.is_valid():
        profile_instance = profile_serializer.save()     #updajtamo profil
        # Oznaci da je profile setup zavrsen
        profile_instance.profile_completed = True
        profile_instance.save()
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


@api_view(['GET'])
@permission_classes([AllowAny])
def authorize(request):
    # Redirecta usera na google auth stranicu

    google_client_id = settings.GOOGLE_WEB_CLIENT_ID
    if not google_client_id:
        return Response(
            {"error": "Missing GOOGLE_WEB_CLIENT_ID"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Dohvati query parametre
    internal_client = request.GET.get("client_id")
    redirect_uri = request.GET.get("redirect_uri")
    state_param = request.GET.get("state", "")
    scope = request.GET.get("scope", "openid email profile")

    # Provjeri client_id
    if internal_client != "google":
        return Response({"error": "Invalid client"}, status=status.HTTP_400_BAD_REQUEST)

    base_url = getattr(settings, 'BASE_URL')


    platform = "mobile"


    # Dodaj platform u state (za callback)
    state = f"{platform}|{state_param}"

    if not state:
        return Response({"error": "Invalid state"}, status=status.HTTP_400_BAD_REQUEST)

    # Kreiraj Google OAuth URL
    
    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"

    params = {
        "client_id": google_client_id,
        "redirect_uri": f"{base_url}/api/auth/callback",
        "response_type": "code",
        "scope": scope,
        "state": state,
        "prompt": "select_account",
    }

    redirect_url = f"{google_auth_url}?{urlencode(params)}"

    print(redirect_uri)

    # Django redirect
    from django.shortcuts import redirect as django_redirect
    return django_redirect(redirect_url)


@api_view(['GET'])
@permission_classes([AllowAny])
def google_callback(request):

    # Google redirecta ovdje nakon sto user odabere google account
    # Prima code i state i onda redirecta nazad na frontend s tim podacima

    code = request.GET.get('code')
    combined_platform_and_state = request.GET.get('state')
    error = request.GET.get('error')

    if error:
        return Response({"error": f"Google OAuth error: {error}"}, status=status.HTTP_400_BAD_REQUEST)

    if not combined_platform_and_state:
        return Response({"error": "Invalid state"}, status=status.HTTP_400_BAD_REQUEST)

    # Parsiraj platform i state (format: "platform|original_state")
    parts = combined_platform_and_state.split("|", 1)
    if len(parts) != 2:
        return Response({"error": "Invalid state format"}, status=status.HTTP_400_BAD_REQUEST)

    platform = parts[0]
    state = parts[1]

    # Kreiraj query parametre za redirect
    outgoing_params = urlencode({
        'code': code or '',
        'state': state
    })

    # Odredi redirect URL na temelju platforme
    app_scheme = getattr(settings, 'APP_SCHEME')
    base_url = getattr(settings, 'BASE_URL')

    if platform == "web":
        redirect_url = f"{base_url}?{outgoing_params}"
    else:  # mobile
        redirect_url = f"{app_scheme}?{outgoing_params}"

    # Redirectaj natrag na frontend s code i state
    response = HttpResponse(
        f'Redirecting to <a href="{redirect_url}">{redirect_url}</a>...',
        status=302
    )
    response['Location'] = redirect_url
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    
    profile = request.user.profile
    if profile.group is None:
        #napravimo groupCode
        groupCode = 10 #dummy value
        while groupCode == 10:
            code = str(random.randint(10000, 99999)) #peteroznamenkasti broj
            if not Group.objects.filter(groupCode=code).exists():
                groupCode = code
        group_data = {
            'groupName' : request.data.get('groupName'), 
            'groupCode' : groupCode,
        }   
    
    
        group_serializer = GroupSerializer(data = group_data)
        if group_serializer.is_valid():
            group = group_serializer.save()
            profile.group = group
            profile.role = 'GroupLeader'     #role usera koji je napravio je GroupLeader posto jedna grupa = jedan user
            profile.save()
            return Response(GroupSerializer(group).data, status=201)
        else :
            return Response(group_serializer.errors, status=400)
    else:
        return Response("User already in group", status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_group(request):
    profile = request.user.profile
    if profile.group is None:
        
        try:
            groupCode = request.data.get('groupCode')
            group = Group.objects.get(groupCode=groupCode)
            profile.group = group
            profile.role = 'GroupMember'
            profile.save()
            return Response(ProfileSerializer(profile).data, status=201)
        except Group.DoesNotExist:
            return Response("Group code is invalid, group doesn't exist", status=400)
        

    else:
        return Response("User already in group", status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leave_group(request):
    profile = request.user.profile
    if profile.group is not None:
        group = profile.group
        #micemo profil iz grupe
        profile.group = None
        profile.role = 'User'
        profile.save()
        #gledamo je li ima jos membera u grupi
        if not group.members.exists():
            group.delete()
            return Response("Left group successfully, the group has been deleted", status=200)
        else:
            #stavljamo da je prvi koji je usao u grupu Leader, ovo je u slucaju da Leader izade
            first_member = group.members.order_by("user__date_joined").first()
            first_member.role = 'GroupLeader'
            first_member.save()
            return Response(
            {
                "message": "Left group successfully",
                "group": GroupSerializer(group).data
            },
                status=200
            )
        
    else:
        return Response("User is not in a group", status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group(request):
    profile = request.user.profile
    if profile.group is None:
        return Response("profile is not in group", status=400)
    group = profile.group
    serializer = GroupSerializer(group)
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_groups(request):
    groups = Group.objects.all()
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_members(request):
    profile = request.user.profile
    if profile.group is None:
        return Response("User is not in a group", status=400)
    group = profile.group
    members = group.members.all()
    serializer = ProfileSerializer(members, many=True)
    return Response(serializer.data, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_group_budget(request):
    profile = request.user.profile
    if profile.group is None:
        return Response("User is not in a group", status=400)
    if not profile.role == 'GroupLeader':
        return Response("User is not the GroupLeader", status=400)
    
    group = profile.group
    group.budget = request.data.get('budget')
    group.save()
    return Response(GroupSerializer(group).data, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_allowance(request):
    profile_leader = request.user.profile
    if not profile_leader.role == 'GroupLeader' :
        return Response("User is not the Leader", status=400)
    user_id = request.data.get("userId")
    allowance = request.data.get("allowance")
    if user_id is None or allowance is None:
        return Response("userId and allowance are required",status=400)
    profile_member = get_object_or_404(
        Profile,
        user__id=user_id,
        group=profile_leader.group
    )
    
    profile_member.allowance = allowance
    profile_member.save()
    return Response(ProfileSerializer(profile_member).data, status=200)
