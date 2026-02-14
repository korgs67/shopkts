from .models import Noutbuk
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class NoutbukSerializers(serializers.ModelSerializer):
    class Meta:
        model = Noutbuk
        fields = ('id', 'link', 'nalichiye', 'description', 'img', 'price')


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.SerializerMethodField()

    def get_phone(self, obj):
        try:
            return obj.profile.phone
        except UserProfile.DoesNotExist:
            return ""

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        phone = validated_data.pop("phone", "")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.update_or_create(user=user, defaults={"phone": phone})
        return user