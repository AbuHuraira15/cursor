from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Payment
from .serializers import PaymentSerializer


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
        payment.status = Payment.Status.COMPLETED
        payment.save(update_fields=["status"])
        return Response(self.get_serializer(payment).data)
