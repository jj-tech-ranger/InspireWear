from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from django.db.models import Sum, F, ExpressionWrapper, fields

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductSummaryView(APIView):
    def get(self, request, *args, **kwargs):
        total_products = Product.objects.count()
        active_products = Product.objects.filter(status='active').count()
        out_of_stock = Product.objects.filter(stock=0).count()
        
        total_value = Product.objects.aggregate(
            total_value=Sum(ExpressionWrapper(F('stock') * F('price'), output_field=fields.DecimalField()))
        )['total_value'] or 0

        data = {
            'total_products': total_products,
            'active_products': active_products,
            'out_of_stock': out_of_stock,
            'total_value': total_value,
        }
        return Response(data)
