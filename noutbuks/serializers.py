from .models import Noutbuk
from rest_framework import serializers
from django.contrib.auth.models import User


class NoutbukSerializers(serializers.ModelSerializer):
    class Meta:
        model = Noutbuk
        fields = ('id', 'link', 'nalichiye', 'description', 'img', 'price')


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'date_joined']