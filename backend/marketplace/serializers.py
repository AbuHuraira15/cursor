from rest_framework import serializers

from .models import Bid, Task


class BidSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(source="worker.get_full_name", read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "task", "worker", "worker_name", "amount", "message", "status", "created_at"]
        read_only_fields = ["worker", "status"]


class TaskSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.get_full_name", read_only=True)
    bids_count = serializers.IntegerField(source="bids.count", read_only=True)
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "client",
            "client_name",
            "title",
            "description",
            "category",
            "location",
            "address",
            "scheduled_date",
            "time_slot",
            "duration",
            "budget",
            "status",
            "assigned_worker",
            "bids_count",
            "bids",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["client", "status", "assigned_worker"]
