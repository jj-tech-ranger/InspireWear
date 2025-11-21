from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, FinanceSummaryView, FinanceChartsView

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('summary/', FinanceSummaryView.as_view(), name='finance-summary'),
    path('charts/', FinanceChartsView.as_view(), name='finance-charts'),
    path('', include(router.urls)),
]
