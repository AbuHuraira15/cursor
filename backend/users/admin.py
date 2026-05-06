from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Marketplace",
            {"fields": ("role", "phone", "preferred_language", "tin_number", "certificate_file", "is_locked", "is_verified")},
        ),
    )
