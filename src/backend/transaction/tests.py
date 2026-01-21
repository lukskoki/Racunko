from django.test import TestCase
from .models import Transaction
from decimal import Decimal
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.deletion import ProtectedError
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.urls import reverse
from unittest.mock import patch

from user.models import Group, Profile
from .models import Category, Store, Transaction, Expense
from .serializers import ExpenseSerializer

class TestTransactionModels(TestCase):
    def setUp(self):
        # User/Group/Profile
        self.user = User.objects.create_user(username='testuser', password='pass')
        self.group = Group.objects.create(groupName='Fam', groupCode='ABC123', budget=1000, income=2000)
        self.profile = Profile.objects.create(
            user=self.user, group=self.group, role='parent', isAdmin=True, budget=300, income=1000, allowance=0
        )

        # Category/Store
        self.category = Category.objects.create(categoryName='Food')
        self.store = Store.objects.create(storeName='Local Store')

    def test_category_str(self):
        self.assertEqual(str(self.category), 'Food')

    def test_store_str(self):
        self.assertEqual(str(self.store), 'Local Store')

    def test_transaction_create_str_and_relations(self):
        tx = Transaction.objects.create(
            profile=self.profile,
            amount=Decimal('123.45'),
            category=self.category,
            group=self.group,
            image='receipt.jpg',
            transactionNote='Lunch with kids',
            store=self.store,
        )
        # __str__
        self.assertEqual(str(tx), 'Lunch with kids')
        # Polja
        self.assertEqual(tx.profile, self.profile)
        self.assertEqual(tx.group, self.group)
        self.assertEqual(tx.category, self.category)
        self.assertEqual(tx.store, self.store)
        self.assertEqual(tx.amount, Decimal('123.45'))
        # Reverse relations
        self.assertEqual(self.profile.transactions.count(), 1)
        self.assertEqual(self.group.transactions.count(), 1)
        self.assertEqual(self.category.transactions.count(), 1)
        self.assertEqual(self.store.transactions.count(), 1)

    def test_transaction_date_autoset(self):
        before = timezone.now()
        tx = Transaction.objects.create(
            profile=self.profile,
            amount=Decimal('10.00'),
            category=self.category,
            group=self.group,
            transactionNote='Auto date test',
            store=self.store,
        )
        self.assertIsNotNone(tx.date)
        # datum je auto_now_add i trebao bi biti "blizu" sada
        self.assertLess(abs((tx.date - before).total_seconds()), 5)

    def test_transaction_on_delete_behaviors(self):
        tx = Transaction.objects.create(
            profile=self.profile,
            amount=Decimal('50.00'),
            category=self.category,
            group=self.group,
            transactionNote='Delete behavior',
            store=self.store,
        )

        # SET_NULL na Category i Store
        self.category.delete()  # SET_NULL
        tx.refresh_from_db()
        self.assertIsNone(tx.category)

        self.store.delete()  # SET_NULL
        tx.refresh_from_db()
        self.assertIsNone(tx.store)

        # PROTECT na Profile i Group
        with self.assertRaises(ProtectedError):
            self.profile.delete()
        with self.assertRaises(ProtectedError):
            self.group.delete()

    def test_expense_create_str_and_reverse(self):       #promjenio expense model pa mjenjam i ovo
        exp = Expense.objects.create(
            profile=self.profile,
            category=self.category,
            expenseName ='Food',
            expenseNote=None,
            expenseLength=12,
            amount = Decimal('250')
        )
        self.assertEqual(str(exp), 'Food')
        self.assertEqual(self.profile.expenses.count(), 1)

    
class TransactionEndpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.group = Group.objects.create(groupName="Fam", groupCode="ABC123")
        self.profile = Profile.objects.create(
            user=self.user, group=self.group, role="GroupLeader", isAdmin=True
        )
        self.token = Token.objects.create(user=self.user)
        self.category = Category.objects.create(categoryName="Food")

    def _auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_get_categories_success(self):
        url = reverse("get_categories")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_manual_create_transaction_success(self):
        url = reverse("manual_create_transaction")
        self._auth()
        info = {
            "amount": "12.34",
            "category": str(self.category.id),
            "date": timezone.now().isoformat(),
        }
        response = self.client.post(url, info, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("amount", response.data)
        self.assertIn("category", response.data)

    @patch("transaction.views.extract_category")
    def test_categorize_receipt_success(self, mock_extract):
        mock_extract.return_value = {"category": "Food", "amount": "10.00"}
        url = reverse("categorize_receipt")
        self._auth()
        response = self.client.post(url, {"image": "aGVsbG8="}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("category_name", response.data)
        self.assertIn("amount", response.data)

    def test_get_expenses_success(self):
        Expense.objects.create(
            profile=self.profile,
            category=self.category,
            expenseName="Rent",
            amount=Decimal("300.00"),
        )
        url = reverse("get_expenses")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_expense_success(self):
        url = reverse("create_expense")
        self._auth()
        info = {
            "category": str(self.category.id),
            "expenseName": "Internet",
            "amount": "50.00",
        }
        response = self.client.post(url, info, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("expenseName", response.data)

    def test_delete_expense_success(self):
        expense = Expense.objects.create(
            profile=self.profile,
            category=self.category,
            expenseName="Phone",
            amount=Decimal("20.00"),
        )
        url = reverse("delete_expense", args=[expense.id])
        self._auth()
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
