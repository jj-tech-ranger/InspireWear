from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoyaltyMemberViewSet, RewardViewSet, LoyaltySummaryView, LoyaltyChartsView

router = DefaultRouter()
router.register(r'members', LoyaltyMemberViewSet)
router.register(r'rewards', RewardViewSet)

urlpatterns = [
    path('summary/', LoyaltySummaryView.as_view(), name='loyalty-summary'),
    path('charts/', LoyaltyChartsView.as_view(), name='loyalty-charts'),
    path('', include(router.urls)),
]
