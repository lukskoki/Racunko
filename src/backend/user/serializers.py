import uuid
from rest_framework import serializers
from models import *
from django.contrib.auth.hashers import make_password


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}   #ne vraca lozinku u responsu radi sigurnosti
        }
    def create(self, validated_data):               #lozinku spremamo kao hash, kasnije se mozemo provjeravati s check_password iz istog importa
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class groupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        extra_kwargs = {
            'groupID' : {'read_only': True}
        }
    

class profileSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(read_only=True)
    groupID = serializers.StringRelatedField(read_only =True)   # pri responsu vraca __str__ od Group tj. groupName
    class Meta:
        model = Profile
        fields = '__all__'
