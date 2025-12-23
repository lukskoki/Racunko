from rest_framework import serializers
from .models import Conversation, Message


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "title"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "message", "created_at", "isUser"]


class ConversationMessageDetails(serializers.ModelSerializer):
    lastMessage = serializers.SerializerMethodField() #Ovdje se sprema rezultat od get_LastMessage jer DRF ih automatski poveze.  
    lastMessageAt = serializers.SerializerMethodField() #Ako treba, moze se i napisati drugi naziv def, ali se onda u SerializerMethodField funckiju mora napisati method_name=

    class Meta:
        model = Conversation
        fields = ["id", "title", "lastMessage", "lastMessageAt"]

    def get_lastMessage(self, object):
        last = object.messages.order_by("created_at", "id").last()
        return last.message if last else ""
    
    def get_lastMessageAt(self, object):
        last = object.messages.order_by("created_at", "id").last()
        return last.created_at if last else None