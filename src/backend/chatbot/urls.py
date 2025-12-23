from django.urls import path

from . import views

urlpatterns = [
    path("message/", views.chatbot, name="chatbot"),
    path("conversations/", views.getConversations, name="conversations"),
    path("conversations/<int:conversation_id>", views.getMessages, name="messages")
]
