from django.db.models import Count, Q
from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from .models import User, Equipment, Team, Request
from .serializers import UserSerializer, RegisterSerializer, EquipmentSerializer, RequestSerializer
from datetime import date # <--- CRITICAL: You are likely missing this
from .models import WorkCenter
from .serializers import WorkCenterSerializer
from django.http import JsonResponse
import random

@api_view(['GET'])
def revenue_chart_data(request):
    # In a real app, you would query your Revenue model here.
    # For now, we simulate data for the last 6 months.
    data = [
        {"name": "Jan", "revenue": 4000, "profit": 2400},
        {"name": "Feb", "revenue": 3000, "profit": 1398},
        {"name": "Mar", "revenue": 2000, "profit": 9800},
        {"name": "Apr", "revenue": 2780, "profit": 3908},
        {"name": "May", "revenue": 1890, "profit": 4800},
        {"name": "Jun", "revenue": 2390, "profit": 3800},
        {"name": "Jul", "revenue": 3490, "profit": 4300},
    ]
    return Response(data)

@api_view(['GET'])
def manager_dashboard_stats(request):
    # 1. Green Card: Open Requests (New or In Progress)
    pending_count = Request.objects.filter(stage__in=['new', 'in_progress']).count()
    overdue_count = Request.objects.filter(scheduled_date__lt=date.today(), stage__in=['new', 'in_progress']).count()

    # 2. Blue Card: Technician Load (Simple logic: Active tasks / Total Techs)
    total_techs = User.objects.filter(role='technician').count()
    active_tasks = Request.objects.filter(stage='in_progress').count()
    # Avoid division by zero
    utilization = int((active_tasks / total_techs) * 100) if total_techs > 0 else 0

    # 3. Red Card: Critical Equipment (Simulated for now based on your wireframe)
    # In a real app, this would check sensor data. We will count Scrapped items or items with many repairs.
    critical_count = Equipment.objects.filter(is_scrapped=True).count() 

    return Response({
        'critical_equipment': critical_count,
        'tech_utilization': utilization,
        'pending_requests': pending_count,
        'overdue_requests': overdue_count
    })

# 1. Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# 2. Login Logic
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role_check = request.data.get('role') # Optional check for staff

    user = authenticate(username=username, password=password)
    
    if user is not None:
        if role_check and user.role != role_check:
             return Response({'error': f'Access Denied. You are not a {role_check}.'}, status=403)
        
        return Response({
            'message': 'Login Successful',
            'user': UserSerializer(user).data
        })
    else:
        return Response({'error': 'Invalid Credentials'}, status=400)

# 3. Data ViewSets (CRUD)
class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

class WorkCenterViewSet(viewsets.ModelViewSet):
    queryset = WorkCenter.objects.all()
    serializer_class = WorkCenterSerializer