from django.db import models
from django.contrib.auth.models import User


class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations")
    title = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_conversation"

    def __str__(self):
        return self.title or f"Conversation({self.id})"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    isUser = models.BooleanField(default=True)

    class Meta:
        db_table = "user_message"
        ordering = ["created_at", "id"]

    def __str__(self):
        return f"Message({self.id}) in Conversation({self.conversation_id})"
