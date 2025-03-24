from django.urls import path, include
from rest_framework import routers
from rest_framework import routers
from .views import NoutbukViewSet

from . import views
from .models import Noutbuk

router = routers.DefaultRouter()
router.register('noutbuks', NoutbukViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls'))
]
