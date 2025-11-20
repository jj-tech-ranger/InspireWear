from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VariantViewSet

router = DefaultRouter()
router.register(r'variants', VariantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
