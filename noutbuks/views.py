from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import filters, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Noutbuk
from .permissions import AllForAdminOtherReadOnly
from .serializers import (
    NoutbukSerializers,
    UserSerializer,
    UserRegistrationSerializer,
)


class NoutbukViewSet(viewsets.ModelViewSet):
    queryset = Noutbuk.objects.all()
    serializer_class = NoutbukSerializers
    permission_classes = (AllForAdminOtherReadOnly,)
    filter_backends = [filters.OrderingFilter]
    search_fields = ['description', 'price']


class RegisterView(APIView):
    """
    POST /api/register/
    """

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "token": token.key,
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/login/
    """

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Укажите логин и пароль"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"detail": "Неверный логин или пароль"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": UserSerializer(user).data,
            }
        )


class ProfileView(APIView):
    """
    GET /api/profile/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)