from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LoyaltyMember, Reward
from .serializers import LoyaltyMemberSerializer, RewardSerializer
from django.db.models import Sum, Count

class LoyaltyMemberViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyMember.objects.all()
    serializer_class = LoyaltyMemberSerializer

class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer

class LoyaltySummaryView(APIView):
    def get(self, request, *args, **kwargs):
        total_members = LoyaltyMember.objects.count()
        points_redeemed = 0 # Placeholder
        redemption_rate = 0 # Placeholder

        data = {
            'total_members': total_members,
            'points_redeemed': points_redeemed,
            'redemption_rate': redemption_rate,
        }
        return Response(data)

class LoyaltyChartsView(APIView):
    def get(self, request, *args, **kwargs):
        # Tier Distribution
        tier_distribution = list(LoyaltyMember.objects.values('tier').annotate(count=Count('id')).order_by('-count'))
        
        data = {
            'tier_distribution': {
                'labels': [item['tier'] for item in tier_distribution],
                'data': [item['count'] for item in tier_distribution],
                'colors': ['#C0C0C0', '#FFD700', '#3498db']
            }
        }
        return Response(data)
