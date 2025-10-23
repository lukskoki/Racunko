from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=150, primary_key=True)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

class Group(models.Model):
    groupID = models.CharField(max_length=255, primary_key=True)
    groupName = models.CharField(max_length=255)
    groupCode = models.CharField(max_length=150, unique=True)
    budget = models.IntegerField(blank=True, null=True)
    income = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.groupName

class Profile(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    groupName = models.ForeignKey(Group,on_delete=models.PROTECT, blank=True, null=True)
    role = models.CharField(max_length=150)
    isAdmin = models.BooleanField(default=False)
    budget = models.IntegerField(blank=True, null=True)
    income = models.IntegerField(blank=True, null=True)
    allowance = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Profile({self.user.username})"