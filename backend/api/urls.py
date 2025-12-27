from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, WorkCenterViewSet, login_view, EquipmentViewSet, RequestViewSet
from .views import RegisterView, login_view, EquipmentViewSet, RequestViewSet, manager_dashboard_stats
from .views import revenue_chart_data # Import this

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'work-centers', WorkCenterViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('', include(router.urls)),
    path('manager-stats/', manager_dashboard_stats, name='manager-stats'),
    path('revenue-data/', revenue_chart_data, name='revenue-data'),

]
