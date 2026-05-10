from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "preferred_language",
            "tin_number",
            "certificate_file",
            "is_locked",
            "is_verified",
            "balance",
        ]
        read_only_fields = ["is_locked", "is_verified", "balance"]


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "preferred_language",
            "tin_number",
            "certificate_file",
            "password",
            "confirm_password",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        if attrs.get("role") == User.Roles.WORKER and not attrs.get("tin_number"):
            raise serializers.ValidationError({"tin_number": "TIN number is required for worker accounts."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_locked:
            raise serializers.ValidationError("This account is locked. Contact support.")
        data["user"] = UserSerializer(self.user).data
        return data
