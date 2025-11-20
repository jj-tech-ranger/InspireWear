from rest_framework import serializers
from .models import LoyaltyMember, Reward

class LoyaltyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyMember
        fields = '__all__'

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'
