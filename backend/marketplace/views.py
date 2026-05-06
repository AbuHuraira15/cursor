from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from users.models import User

from .models import Bid, Task
from .serializers import BidSerializer, TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.select_related("client", "assigned_worker").prefetch_related("bids")
        user = self.request.user
        query = self.request.query_params.get("q")
        category = self.request.query_params.get("category")
        status_value = self.request.query_params.get("status")

        if user.role == User.Roles.CLIENT:
            queryset = queryset.filter(Q(client=user) | Q(status=Task.Status.OPEN))
        if user.role == User.Roles.WORKER:
            queryset = queryset.filter(Q(status=Task.Status.OPEN) | Q(assigned_worker=user) | Q(bids__worker=user)).distinct()

        if query:
            queryset = queryset.filter(Q(title__icontains=query) | Q(description__icontains=query))
        if category:
            queryset = queryset.filter(category__iexact=category)
        if status_value:
            queryset = queryset.filter(status=status_value)

        return queryset

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=["post"])
    def assign(self, request, pk=None):
        task = self.get_object()
        if request.user != task.client and request.user.role != User.Roles.ADMIN:
            return Response({"detail": "Only task owner/admin can assign."}, status=status.HTTP_403_FORBIDDEN)
        bid_id = request.data.get("bid_id")
        bid = Bid.objects.filter(id=bid_id, task=task).first()
        if not bid:
            return Response({"detail": "Bid not found."}, status=status.HTTP_404_NOT_FOUND)
        bid.status = Bid.Status.ACCEPTED
        bid.save(update_fields=["status"])
        Bid.objects.filter(task=task).exclude(id=bid.id).update(status=Bid.Status.REJECTED)
        task.assigned_worker = bid.worker
        task.status = Task.Status.ASSIGNED
        task.save(update_fields=["assigned_worker", "status", "updated_at"])
        return Response(TaskSerializer(task, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        task = self.get_object()
        if request.user not in [task.client, task.assigned_worker] and request.user.role != User.Roles.ADMIN:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        task.status = Task.Status.COMPLETED
        task.save(update_fields=["status", "updated_at"])
        return Response(TaskSerializer(task, context={"request": request}).data)


class BidViewSet(viewsets.ModelViewSet):
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Bid.objects.select_related("task", "worker")
        if user.role == User.Roles.WORKER:
            return queryset.filter(worker=user)
        if user.role == User.Roles.CLIENT:
            return queryset.filter(task__client=user)
        return queryset

    def create(self, request, *args, **kwargs):
        task_id = request.data.get("task")
        task = Task.objects.filter(id=task_id).first()
        if not task:
            return Response({"detail": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        if task.status != Task.Status.OPEN:
            return Response({"detail": "This task is not open for bids."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(worker=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
