from django.db import models
from django.contrib.auth.models import User # Koristimo django User model jer vec po sebi ima sve potrebne funkcionalnosti
from django.core.validators import RegexValidator


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
    role = models.CharField(max_length=150, default='User')     #dodao da je default user
    isAdmin = models.BooleanField(default=False)
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    allowance = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notifications = models.BooleanField(default=False)  #dodano za profile create page 1
    income_date = models.CharField(blank=True, null=True, max_length=5, validators=[RegexValidator(r'^\d{2}-\d{2}$', 'Date must be formatted as DD-MM format')])   #stavio charfield s DD-MM formatom i validatorom
     #dodano  za profile create page 1, stavljam integer za sad ako gledamo 1., 2. itd. u mjesecu. Ne tocan datum


    def __str__(self):
        return f"Profile({self.user.username})"