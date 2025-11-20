from rest_framework.views import APIView
from rest_framework.response import Response

class CustomerReportView(APIView):
    def get(self, request, *args, **kwargs):
        # In a real application, you would generate this data from your models
        data = {
            "metrics": [
                {"metric": "New Customers", "current": "245", "previous": "210", "change": "+16.7%", "trend": "up"},
                {"metric": "Repeat Customers", "current": "520", "previous": "450", "change": "+15.6%", "trend": "up"},
            ],
            "customer_growth": {
                "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                "new_customers": [120, 150, 180, 210, 190, 280],
                "returning_customers": [420, 450, 480, 520, 490, 620],
            },
            "customer_locations": {
                "labels": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Other"],
                "data": [1250, 450, 320, 210, 220],
                "colors": ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6"],
            },
            "loyalty_tiers": {
                "labels": ["Silver", "Gold", "Platinum"],
                "data": [650, 350, 240],
                "colors": ["#C0C0C0", "#FFD700", "#3498db"],
            },
            "feedback_sentiment": {
                "labels": ["Positive", "Negative", "Neutral"],
                "data": [78, 12, 10],
                "colors": ["#2ecc71", "#e74c3c", "#95a5a6"],
            },
            "campaign_performance": {
                "labels": ["Open Rate", "Click Rate", "Conversion Rate"],
                "data": [32.5, 8.7, 3.2],
                "colors": ["#3498db", "#f1c40f", "#2ecc71"],
            },
        }
        return Response(data)
