from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        CLIENT = "client", "Client"
        WORKER = "worker", "Worker"
        ADMIN = "admin", "Admin"

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.CLIENT)
    phone = models.CharField(max_length=32, blank=True)
    preferred_language = models.CharField(max_length=10, default="en")
    tin_number = models.CharField(max_length=64, blank=True)
    certificate_file = models.FileField(upload_to="certificates/", blank=True, null=True)
    is_locked = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"
