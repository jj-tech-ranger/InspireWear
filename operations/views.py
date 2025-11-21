from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Activity
from .serializers import ActivitySerializer
from payroll.models import Employee
from orders.models import Order
from task_management.models import Task
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class OperationsSummaryView(APIView):
    def get(self, request, *args, **kwargs):
        staff_on_duty = Employee.objects.filter(status='active').count()
        pending_returns = Order.objects.filter(status='return-pending').count()
        completed_tasks = Task.objects.filter(status='completed').count()

        data = {
            'staff_on_duty': staff_on_duty,
            'pending_returns': pending_returns,
            'completed_tasks': completed_tasks,
        }
        return Response(data)

class OperationsChartsView(APIView):
    def get(self, request, *args, **kwargs):
        # Store Traffic
        labels = []
        traffic_data = []
        for i in range(7):
            date = timezone.now() - timedelta(days=i)
            labels.append(date.strftime('%a'))
            # This is placeholder data
            traffic_data.append(random.randint(200, 700))

        store_traffic = {
            "labels": labels[::-1],
            "data": traffic_data[::-1]
        }

        # Staff Distribution
        staff_distribution = list(Employee.objects.values('location').annotate(count=Count('id')).order_by('-count'))
        
        data = {
            'store_traffic': store_traffic,
            'staff_distribution': {
                'labels': [item['location'] for item in staff_distribution],
                'data': [item['count'] for item in staff_distribution],
                'colors': ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6']
            }
        }
        return Response(data)
