from rest_framework import viewsets
from .models import LoyaltyMember, Reward
from .serializers import LoyaltyMemberSerializer, RewardSerializer

class LoyaltyMemberViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyMember.objects.all()
    serializer_class = LoyaltyMemberSerializer

class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer
