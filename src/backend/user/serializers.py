import uuid
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Group, Profile


class UserSerializer(serializers.ModelSerializer):
    profile_completed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile_completed']
        extra_kwargs = {
            'password': {'write_only': True}   # ne vraca lozinku u responsu radi sigurnosti
        }

    def get_profile_completed(self, obj):
        # Vrati profile_completed iz povezanog Profile objekta
        try:
            return obj.profile.profile_completed
        except Profile.DoesNotExist:
            return False

    def create(self, validated_data):
        # Koristimo create_user od djangovog User modela jer vec ima dosta funkcionalnosti
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        #dodavam da se automatski napravi i profil
        Profile.objects.create(user = user)
        return user

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
    def create(self, validated_data):
        
        return super().create(validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    group = serializers.StringRelatedField(read_only=True)   # pri responsu vraca __str__ od Group tj. groupName
    class Meta:
        model = Profile
        fields = '__all__'
    
