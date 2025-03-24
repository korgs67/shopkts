from django.shortcuts import render
from rest_framework import generics

from .models import Noutbuk
from .serializers import NoutbukSerializers
from .serializers import NoutbukSerializers
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from . permissions import AllForAdminOtherReadOnly
from rest_framework import filters


class NoutbukViewSet(viewsets.ModelViewSet):
    queryset = Noutbuk.objects.all()
    serializer_class = NoutbukSerializers
    permission_classes = (AllForAdminOtherReadOnly,)
    filter_backends = [filters.OrderingFilter]
    search_fields = ['description', 'price']

class UsersViewSet(viewsets.ModelViewSet):
  pass





