from django.db import models
from django.contrib.auth.models import User # Koristimo django User model jer vec po sebi ima sve potrebne funkcionalnosti


class Group(models.Model):
    groupName = models.CharField(max_length=255)
    groupCode = models.CharField(max_length=150, unique=True)
    budget =  models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return self.groupName

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    group = models.ForeignKey(Group,on_delete=models.PROTECT, blank=True, null=True)
    role = models.CharField(max_length=150)
    isAdmin = models.BooleanField(default=False)
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    allowance = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Profile({self.user.username})"