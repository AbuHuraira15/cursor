from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Payment
from .serializers import PaymentSerializer
from decimal import Decimal


from django.db import transaction
from users.models import User

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(client=user) | Payment.objects.filter(worker=user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        payment = self.get_object()
        if request.user != payment.client:
            return Response({"detail": "Only client can confirm payment."}, status=status.HTTP_403_FORBIDDEN)
        
        if payment.status == Payment.Status.COMPLETED:
            return Response({"detail": "Payment is already completed."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            payment.status = Payment.Status.COMPLETED
            payment.save(update_fields=["status"])
            
            # Calculate 90% for worker, 10% for admin
            amount = payment.task_amount
            worker_share = amount * Decimal("0.90")
            admin_share = amount * Decimal("0.10")
            
            # Update worker balance
            worker = payment.worker
            worker.balance += worker_share
            worker.save(update_fields=["balance"])
            
            # Update admin balance (first admin found)
            admin_user = User.objects.filter(role=User.Roles.ADMIN).first()
            if admin_user:
                admin_user.balance += admin_share
                admin_user.save(update_fields=["balance"])

        return Response(self.get_serializer(payment).data)
