from django.conf import settings
from django.db import models

from marketplace.models import Task


class Payment(models.Model):
    class Method(models.TextChoices):
        CARD = "card", "Card"
        PAYPAL = "paypal", "Paypal"
        BANK = "bank", "Bank"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="payments")
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments_made")
    worker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments_received")
    task_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.CARD)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
