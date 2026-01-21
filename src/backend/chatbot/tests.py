from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.urls import reverse
from unittest.mock import patch

from .models import Conversation, Message


class ChatbotEndpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.token = Token.objects.create(user=self.user)

    def _auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    @patch("chatbot.views.ai_chat")
    def test_chatbot_success(self, mock_ai_chat):
        mock_ai_chat.return_value = {"message": "Pozdrav!"}
        url = reverse("chatbot")
        self._auth()
        response = self.client.post(url, {"message": "Bok"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("conversation_id", response.data)
        self.assertIn("message", response.data)

    def test_get_conversations_success(self):
        Conversation.objects.create(user=self.user, title="Test convo")
        url = reverse("conversations")
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_messages_success(self):
        convo = Conversation.objects.create(user=self.user, title="Test convo")
        Message.objects.create(conversation=convo, message="Hej", isUser=True)
        url = reverse("messages", args=[convo.id])
        self._auth()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)
