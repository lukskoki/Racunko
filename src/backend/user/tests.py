from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from .models import Profile, Group
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from django.utils import timezone
from decimal import Decimal
from unittest.mock import patch
from transaction.models import Category, Transaction, Expense


class TestModels(TestCase):
    def setUp(self):
        
        self.user = User.objects.create_user(username='testuser', password='password')
        self.group = Group.objects.create(
            groupName='test group',
            groupCode='test code',
            budget=200.00,
            income=1000.99
        )

    def test_model_group(self):
        # Provjera da se group ispravno kreirao
        self.assertEqual(str(self.group), 'test group')
        self.assertTrue(isinstance(self.group, Group))
        self.assertEqual(self.group.groupCode, 'test code')
        self.assertEqual(float(self.group.budget), 200.00)
        self.assertEqual(float(self.group.income), 1000.99)
    

    def test_model_profile(self):
        

        profile = Profile.objects.create(
            user=self.user,
            group=self.group,
            role='parent',
            isAdmin='True',
            budget=300.11,
            income=1000.99,
            allowance=0,
            notifications = False,
            income_date = 1
        )
        self.assertEqual(str(profile), 'Profile(testuser)')
        self.assertTrue(isinstance(profile, Profile))
        self.assertEqual(profile.role, 'parent')
        self.assertTrue(profile.isAdmin)
        self.assertEqual(profile.group, self.group)
        self.assertFalse(profile.notifications)


class endpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="marko",
            email="marko@gmail.com",
            password="1234",
            first_name="Marko",
            last_name="Maric",
        )
        self.profile = Profile.objects.create(user=self.user, role="user", isAdmin=False)
        self.token = Token.objects.create(user=self.user)
        self.other_user = User.objects.create_user(
            username="ana",
            email="ana@gmail.com",
            password="1234",
        )
        self.other_profile = Profile.objects.create(user=self.other_user, role="user", isAdmin=False)
        self.category = Category.objects.create(categoryName="Food")

    def _auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}") # stavi token u header za AUTHORIZATION

    def test_register_success(self):
        url = reverse("register")
        info = {
            "username": "ivan",
            "email": "ivan@gmail.com",
            "password": "123",
            "first_name": "Ivan",
            "last_name": "Horvat",
            "role": "user",
        }
        response = self.client.post(url, info, format="json")
        self.assertEqual(response.status_code, 201) #treba vratiti CREATED
        self.assertIn("token", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["username"], "ivan")
        self.assertTrue(User.objects.get(username="ivan").check_password("123"))
        self.assertTrue(Profile.objects.filter(user=User.objects.get(username="ivan")).exists())

    def test_login_success(self):
        url = reverse("login")
        info = {
            "username": "marko",
            "password": "1234",
        }
        response = self.client.post(url, info, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["username"], "marko")

    def test_logout_success(self):
        url = reverse("logout")
        self._auth() 
        response = self.client.post(url, format="json")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Token.objects.filter(user=self.user).exists())

    @override_settings(GOOGLE_WEB_CLIENT_ID="test-client") # moramo napraviti jer inace view padne
    @patch("user.views.google_id_token.verify_oauth2_token") # ovo se radi umjesto zvanja pravog google auth2 pa da simuliramo
    def test_google_auth_success(self, mock_verify):
        mock_verify.return_value = {"email": "g@example.com", "name": "G User"}# ovo je sta bi google vratio, mock je zaorav samo funckija koja simulira verify_oauth2_token
        url = reverse("google_auth")
        response = self.client.post(url, {"id_token": "dummy"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], "g@example.com")

    @override_settings(GOOGLE_WEB_CLIENT_ID="test-client", BASE_URL="http://localhost:8000")
    def test_authorize_success(self):
        url = reverse("google_authorize")
        response = self.client.get(url, {"client_id": "google", "redirect_uri": "http://example.com", "state": "xyz"})
        self.assertEqual(response.status_code, 302)
        self.assertIn("accounts.google.com", response["Location"])

    @override_settings(APP_SCHEME="myapp://cb", BASE_URL="http://localhost:8000")
    def test_google_callback_success(self):
        response = self.client.get("/api/auth/callback/", {"code": "abc", "state": "mobile|s1"})
        self.assertEqual(response.status_code, 302)
        self.assertIn("myapp://cb", response["Location"])
        self.assertIn("code=abc", response["Location"])
        self.assertIn("state=s1", response["Location"])

    def test_profile_setup_success(self):
        url = reverse("profile_setup")
        self._auth()
        info = {
            "income": 1000,
            "notifications": True,
            "income_date": "15",
            "expenses": [
                {
                    "category": self.category.id,
                    "expenseName": "popravak",
                    "expenseLength": 12,
                    "amount": "300.00",
                }
            ],
        }
        response = self.client.post(url, info, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("profile", response.data)
        self.assertIn("expenses", response.data)
        self.profile.refresh_from_db()# Potrebno kako bi mogli viditi novu promjenu kod profile_completed
        self.assertTrue(self.profile.profile_completed)

    def test_create_group_success(self):
        url = reverse("create_group")
        self._auth()
        response = self.client.post(url, {"groupName": "Test Group"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("groupName", response.data)
        self.profile.refresh_from_db()
        self.assertIsNotNone(self.profile.group)

    def test_join_group_success(self):
        group = Group.objects.create(groupName="Group A", groupCode="12345")
        url = reverse("join_group")
        self._auth()
        response = self.client.post(url, {"groupCode": "12345"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("role", response.data)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.group, group)

    def test_leave_group_success(self):
        group = Group.objects.create(groupName="Group B", groupCode="54321")
        self.profile.group = group
        self.profile.role = "GroupMember"
        self.profile.save() # spremi podatke u testnu bazu
        self.other_profile.group = group
        self.other_profile.role = "GroupLeader"
        self.other_profile.save()
        url = reverse("leave_group")
        self._auth()
        response = self.client.post(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

    def test_get_group_success(self):
        group = Group.objects.create(groupName="Group C", groupCode="67890")
        self.profile.group = group
        self.profile.save()
        url = reverse("get_group")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["groupName"], "Group C")

    def test_get_all_groups_success(self):
        Group.objects.create(groupName="Group D", groupCode="22222")
        url = reverse("get_all_groups")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_members_success(self):
        group = Group.objects.create(groupName="Group E", groupCode="33333")
        self.profile.group = group
        self.profile.save()
        self.other_profile.group = group
        self.other_profile.save()
        url = reverse("get_members")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_change_group_budget_success(self):
        group = Group.objects.create(groupName="Group F", groupCode="44444")
        self.profile.group = group
        self.profile.role = "GroupLeader"
        self.profile.save()
        url = reverse("change_group_budget")
        self._auth()
        response = self.client.post(url, {"budget": "500.00"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("budget", response.data)

    def test_change_user_allowance_success(self):
        group = Group.objects.create(groupName="Group G", groupCode="55555")
        self.profile.group = group
        self.profile.role = "GroupLeader"
        self.profile.save()
        self.other_profile.group = group
        self.other_profile.save()
        url = reverse("change_user_allowance")
        self._auth()
        response = self.client.post(
            url, {"userId": self.other_user.id, "allowance": "50.00"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("allowance", response.data)

    def test_get_member_spending_success(self):
        group = Group.objects.create(groupName="Group H", groupCode="66666")
        self.profile.group = group
        self.profile.save()
        self.other_profile.group = group
        self.other_profile.save()
        Transaction.objects.create(
            profile=self.other_profile,
            amount=Decimal("12.34"),
            category=self.category,
            group=group,
            transactionNote="Test",
            date=timezone.now(),
        )
        url = reverse("get_member_spending")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_member_transactions_success(self):
        group = Group.objects.create(groupName="Group I", groupCode="77777")
        self.profile.group = group
        self.profile.role = "GroupLeader"
        self.profile.save()
        self.other_profile.group = group
        self.other_profile.save()
        Transaction.objects.create(
            profile=self.other_profile,
            amount=Decimal("10.00"),
            category=self.category,
            group=group,
            transactionNote="Test",
            date=timezone.now(),
        )
        url = reverse("get_member_transactions", args=[self.other_user.id])
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_analytics_success(self):
        group = Group.objects.create(groupName="Group J", groupCode="88888")
        self.profile.group = group
        self.profile.save()
        Transaction.objects.create(
            profile=self.profile,
            amount=Decimal("20.00"),
            category=self.category,
            group=group,
            transactionNote="Analytics",
            date=timezone.now(),
        )
        Expense.objects.create(
            profile=self.profile,
            category=self.category,
            expenseName="Rent",
            amount=Decimal("30.00"),
        )
        url = reverse("analytics")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("personalAnalytics", response.data)

    
        
