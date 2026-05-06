from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BidViewSet, TaskViewSet

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
router.register("bids", BidViewSet, basename="bid")

urlpatterns = [
    path("", include(router.urls)),
]
