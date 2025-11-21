from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, OperationsSummaryView, OperationsChartsView

router = DefaultRouter()
router.register(r'activities', ActivityViewSet)

urlpatterns = [
    path('summary/', OperationsSummaryView.as_view(), name='operations-summary'),
    path('charts/', OperationsChartsView.as_view(), name='operations-charts'),
    path('', include(router.urls)),
]
