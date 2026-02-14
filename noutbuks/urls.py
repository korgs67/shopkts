from django.urls import path, include
from rest_framework import routers

from .views import NoutbukViewSet, RegisterView, LoginView, ProfileView

router = routers.DefaultRouter()
router.register('noutbuks', NoutbukViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # DRF built-in login templates (not used by SPA, but can be handy in admin)
    path('auth/', include('rest_framework.urls')),
    # API авторизация/регистрация/профиль для фронтенда
    path('api/register/', RegisterView.as_view(), name='api-register'),
    path('api/login/', LoginView.as_view(), name='api-login'),
    path('api/profile/', ProfileView.as_view(), name='api-profile'),
]
