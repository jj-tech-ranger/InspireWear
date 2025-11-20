from django.urls import path
from .views import CustomerReportView

urlpatterns = [
    path('customers/', CustomerReportView.as_view(), name='customer-reports'),
]
