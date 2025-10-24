import uuid
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Group, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']  # Dodao id i ime, prezime
        extra_kwargs = {
            'password': {'write_only': True}   # ne vraca lozinku u responsu radi sigurnosti
        }

    def create(self, validated_data):
        # Koristimo create_user od djangovog User modela jer vec ima dosta funkcionalnosti
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    group = serializers.StringRelatedField(read_only=True)   # pri responsu vraca __str__ od Group tj. groupName
    class Meta:
        model = Profile
        fields = '__all__'
