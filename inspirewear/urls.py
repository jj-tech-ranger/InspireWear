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
    path('', TemplateView.as_view(template_name='campaigns.html')),
]
