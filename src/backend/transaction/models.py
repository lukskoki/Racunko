from django.db import models
from user.models import Profile, Group
# Create your models here.

class Category(models.Model):
    categoryName = models.CharField(max_length=150)

    def __str__(self):
        return self.categoryName


class Store(models.Model):
    storeName = models.CharField(max_length=150)

    def __str__(self):
        return self.storeName


class Transaction(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.PROTECT, related_name="transactions") #related_name omogucuje pristup svim transakcijama preko profile.transactions.all()
    amount = models.DecimalField(max_digits=10, decimal_places=2) # Mora bit decimal, a ne integer
    date = models.DateTimeField(auto_now_add=True) #dodao auto_now_add da vidimo kada je napravljena instanca
    # Category Id mora bit foreignKey
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="transactions") #on_delete=models.SET_NULL ce postaviti taj categoryID na null
    group = models.ForeignKey(Group, on_delete=models.PROTECT, related_name="transactions", blank=True, null=True)  # dodao da je groupID foreign key, ista sema kao username samo optional
    image = models.CharField(max_length=255, blank=True, null=True)
    transactionNote = models.CharField(max_length=255, blank=True, null=True)
    # Store id mora bit Foreign Key
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, blank=True, null=True, related_name="transactions")

    def __str__(self):        
        return self.transactionNote

class Expense(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.PROTECT, related_name="expenses") #related_name omogucuje pristup svim expensa preko profile.expenses.all()
    expenseName = models.CharField(max_length=150)
    expenseNote = models.CharField(max_length=255, blank=True, null=True) #ovo mi ima vise smisla kao optional
    expenseLength = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.expenseName