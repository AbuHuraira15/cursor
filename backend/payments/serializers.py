from decimal import Decimal

from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "task",
            "client",
            "worker",
            "task_amount",
            "platform_fee",
            "total_amount",
            "method",
            "status",
            "created_at",
        ]
        read_only_fields = ["client", "platform_fee", "total_amount", "status"]

    def validate(self, attrs):
        attrs["platform_fee"] = attrs["task_amount"] * Decimal("0.10")
        attrs["total_amount"] = attrs["task_amount"] + attrs["platform_fee"]
        return attrs
