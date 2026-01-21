from django.urls import path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('user.urls')),
    path('api/transaction/', include('transaction.urls')),
]

if os.environ.get("OPENAI_API_KEY"):
    urlpatterns += [path('api/chatbot/', include('chatbot.urls'))]