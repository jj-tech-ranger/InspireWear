from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer
from django.db.models import Sum, Case, When, DecimalField, Count
from django.utils import timezone
from datetime import timedelta

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class FinanceSummaryView(APIView):
    def get(self, request, *args, **kwargs):
        total_revenue = Transaction.objects.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = Transaction.objects.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_profit = total_revenue - total_expenses
        
        data = {
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': net_profit,
        }
        return Response(data)

class FinanceChartsView(APIView):
    def get(self, request, *args, **kwargs):
        # Revenue vs Expenses
        labels = []
        revenue_data = []
        expenses_data = []
        for i in range(6):
            date = timezone.now() - timedelta(days=30 * i)
            labels.append(date.strftime('%B'))
            revenue = Transaction.objects.filter(type='income', date__month=date.month, date__year=date.year).aggregate(total=Sum('amount'))['total'] or 0
            expenses = Transaction.objects.filter(type='expense', date__month=date.month, date__year=date.year).aggregate(total=Sum('amount'))['total'] or 0
            revenue_data.append(revenue)
            expenses_data.append(expenses)

        financial_movement = {
            "labels": labels[::-1],
            "revenue": revenue_data[::-1],
            "expenses": expenses_data[::-1]
        }

        # Expense Breakdown
        expense_categories = list(Transaction.objects.filter(type='expense').values('category').annotate(amount=Sum('amount')).order_by('-amount'))
        
        data = {
            'financial_movement': financial_movement,
            'expense_categories': {
                'labels': [item['category'] for item in expense_categories],
                'data': [item['amount'] for item in expense_categories],
                'colors': ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6']
            }
        }
        return Response(data)
