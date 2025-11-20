from rest_framework import viewsets
from .models import Variant
from .serializers import VariantSerializer

class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.all()
    serializer_class = VariantSerializer
