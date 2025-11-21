"""
URL configuration for inspirewear project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/campaigns/', include('campaigns.urls')),
    path('api/products/', include('products.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/finance/', include('finance.urls')),
    path('api/loyalty/', include('loyalty.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/variants/', include('variants.urls')),
    path('api/suppliers/', include('suppliers.urls')),
    path('api/operations/', include('operations.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/tasks/', include('task_management.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('campaigns/', TemplateView.as_view(template_name='campaigns.html'), name='campaigns'),
    path('customer_dashboard/', TemplateView.as_view(template_name='customer_dasboard.html'), name='customer_dashboard'),
    path('customers/', TemplateView.as_view(template_name='customers.html'), name='customers'),
    path('customer_reports/', TemplateView.as_view(template_name='customer_reports.html'), name='customer_reports'),
    path('expenses/', TemplateView.as_view(template_name='expenses.html'), name='expenses'),
    path('feedback/', TemplateView.as_view(template_name='feedback.html'), name='feedback'),
    path('finance_dashboard/', TemplateView.as_view(template_name='finance_dashboard.html'), name='finance_dashboard'),
    path('finance_notifications/', TemplateView.as_view(template_name='finance_notifications.html'), name='finance_notifications'),
    path('financial_reports/', TemplateView.as_view(template_name='financial_reports.html'), name='financial_reports'),
    path('inventory_dashboard/', TemplateView.as_view(template_name='inventory_dashboard.html'), name='inventory_dashboard'),
    path('inventory_notifications/', TemplateView.as_view(template_name='inventory_notifications.html'), name='inventory_notifications'),
    path('inventory_reports/', TemplateView.as_view(template_name='inventory_reports.html'), name='inventory_reports'),
    path('invoices/', TemplateView.as_view(template_name='invoices.html'), name='invoices'),
    path('loyalty/', TemplateView.as_view(template_name='loyalty.html'), name='loyalty'),
    path('operations_dashboard/', TemplateView.as_view(template_name='operations_dashboard.html'), name='operations_dashboard'),
    path('operations_notifications/', TemplateView.as_view(template_name='operations_notifications.html'), name='operations_notifications'),
    path('operations_reports/', TemplateView.as_view(template_name='operations_reports.html'), name='operations_reports'),
    path('orders/', TemplateView.as_view(template_name='orders.html'), name='orders'),
    path('payroll/', TemplateView.as_view(template_name='payroll.html'), name='payroll'),
    path('products/', TemplateView.as_view(template_name='products.html'), name='products'),
    path('returns_exchanges/', TemplateView.as_view(template_name='returns_exchanges.html'), name='returns_exchanges'),
    path('shop_dashboard/', TemplateView.as_view(template_name='shop_dashboard.html'), name='shop_dashboard'),
    path('sign_up/', TemplateView.as_view(template_name='sign_up.html'), name='sign_up'),
    path('staff_scheduling/', TemplateView.as_view(template_name='staff_scheduling.html'), name='staff_scheduling'),
    path('suppliers/', TemplateView.as_view(template_name='suppliers.html'), name='suppliers'),
    path('task_management/', TemplateView.as_view(template_name='task_management.html'), name='task_management'),
    path('transactions/', TemplateView.as_view(template_name='transactions.html'), name='transactions'),
    path('variants/', TemplateView.as_view(template_name='variants.html'), name='variants'),
    path('login/', TemplateView.as_view(template_name='login.html'), name='login'),
]
