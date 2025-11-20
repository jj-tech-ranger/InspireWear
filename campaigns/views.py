from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Campaign, Template
from .serializers import CampaignSerializer, TemplateSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    @action(detail=False, methods=['get'])
    def overview(self, request):
        total_campaigns = Campaign.objects.count()
        # These are just example calculations, you'll need to replace them with your actual logic
        open_rate = Campaign.objects.aggregate(avg_open_rate=models.Avg('open_rate'))['avg_open_rate'] or 0
        click_rate = Campaign.objects.aggregate(avg_click_rate=models.Avg('click_rate'))['avg_click_rate'] or 0
        conversion_rate = 0 # Replace with your conversion rate calculation
        return Response({
            'totalCampaigns': total_campaigns,
            'openRate': open_rate,
            'clickRate': click_rate,
            'conversionRate': conversion_rate,
        })

    def get_queryset(self):
        queryset = Campaign.objects.all()
        status = self.request.query_params.get('status')
        type = self.request.query_params.get('type')
        search = self.request.query_params.get('search')

        if status and status != 'all':
            queryset = queryset.filter(status=status)
        if type and type != 'all':
            queryset = queryset.filter(type=type)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
