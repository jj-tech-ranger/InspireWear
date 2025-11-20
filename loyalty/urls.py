from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoyaltyMemberViewSet, RewardViewSet

router = DefaultRouter()
router.register(r'members', LoyaltyMemberViewSet)
router.register(r'rewards', RewardViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
