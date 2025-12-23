import logging

from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils.ai_chat_client import ai_chat
from .models import Conversation, Message
from transaction.models import Transaction
from transaction.serializers import TransactionSerializer
from .serializers import *


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot(request):
    user_message = request.data.get("message")
    conversation_id = request.data.get("conversation_id")
    title = request.data.get("title")
    if not user_message:
        return Response({"error": "Missing 'message' in body"}, status=400)

    try:
        with transaction.atomic():
            if conversation_id:
                try:
                    conversation = Conversation.objects.get(id=conversation_id, user=request.user)
                except Conversation.DoesNotExist:
                    return Response({"error": "Conversation not found"}, status=404)
            else:
                conversation_title = (title or "").strip() or user_message.strip()[:80]
                conversation = Conversation.objects.create(user=request.user, title=conversation_title)

            Message.objects.create(conversation=conversation, message=user_message, isUser=True)

        history_qs = Message.objects.filter(conversation=conversation).order_by("created_at", "id")
        history = [{"role": ("user" if m.isUser else "assistant"), "content": m.message} for m in history_qs]


        transactions_qs = Transaction.objects.filter(profile__user=request.user) #ako user nema profile, i dalje moze pricati s chatbottom, samo nema nikakve transakcije za koje ga moze pitati jer nema profile
        transactions = [
            {
                "role": "user",
                "content": f"amount: {t.amount}, date: {t.date}, category: {t.category}",
            }
            for t in transactions_qs
        ]

        ai_result = ai_chat(history, transactions)  # {'message': '...'}
        if not isinstance(ai_result, dict) or "message" not in ai_result:
            raise ValueError("Neispravan format odgovora")

        assistant_message = ai_result.get("message", "")

        with transaction.atomic():
            Message.objects.create(conversation=conversation, message=assistant_message, isUser=False)

        return Response({"conversation_id": conversation.id, "message": assistant_message}, status=200)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=404)
    except ValueError as e:
        return Response({"error": f"Invalid response: {e}"}, status=500)
    except Exception:
        logger = logging.getLogger(__name__)
        logger.exception("Unexpected error in chatbot endpoint")
        return Response({"error": "An unexpected error occurred"}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getConversations(request):
    conversations = Conversation.objects.filter(user=request.user).order_by("id")
    data = ConversationMessageDetails(conversations, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMessages(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id = conversation_id, user = request.user)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation doesn't exist"}, status=404)
    
    messages = Message.objects.filter(conversation = conversation).order_by("created_at", "id")
    data = MessageSerializer(messages, many=True).data
    return Response(data)