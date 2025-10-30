from django.test import TestCase
from .models import Transaction
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.deletion import ProtectedError

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

    
        
