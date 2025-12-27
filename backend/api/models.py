from django.db import models
from django.contrib.auth.models import AbstractUser

class WorkCenter(models.Model):
    name = models.CharField(max_length=100) # e.g. "Assembly 1"
    code = models.CharField(max_length=50, unique=True)
    capacity = models.FloatField(default=100.0)
    oee_target = models.FloatField(default=90.0)
    cost_per_hour = models.FloatField(default=0.0)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

# 2. UPDATE: Request Model
class Request(models.Model):
    subject = models.CharField(max_length=200)
    
    # SELECTION LOGIC: A request is for EITHER Equipment OR a Work Center
    MAINTENANCE_FOR_CHOICES = (
        ('equipment', 'Equipment'),
        ('work_center', 'Work Center'),
    )
    maintenance_for = models.CharField(max_length=20, choices=MAINTENANCE_FOR_CHOICES, default='equipment')
    
    # Now Equipment must be nullable because user might select Work Center instead
    equipment = models.ForeignKey('Equipment', on_delete=models.SET_NULL, null=True, blank=True)
    work_center = models.ForeignKey('WorkCenter', on_delete=models.SET_NULL, null=True, blank=True)

    # ... keep existing fields (request_type, stage, dates, etc.) ...
    TYPE_CHOICES = (('corrective', 'Corrective'), ('preventive', 'Preventive'))
    request_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='corrective')
    
    STAGE_CHOICES = (('new', 'New'), ('in_progress', 'In Progress'), ('repaired', 'Repaired'), ('scrap', 'Scrap'))
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='new')
    
    scheduled_date = models.DateField(null=True, blank=True)
    duration = models.FloatField(default=0.0)
    
    assigned_team = models.ForeignKey('Team', on_delete=models.SET_NULL, null=True)
    assigned_technician = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, related_name='tasks')
# 1. Custom User Model (User, Technician, Manager)
class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'General User'),
        ('technician', 'Technician'),
        ('manager', 'Manager'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    # AbstractUser already has username (unique ID), password, email

# 2. Maintenance Team [cite: 19]
class Team(models.Model):
    name = models.CharField(max_length=100) # e.g., Mechanics, IT
    members = models.ManyToManyField(User, related_name='teams')

    def __str__(self):
        return self.name

# 3. Equipment [cite: 7]
class Equipment(models.Model):
    name = models.CharField(max_length=100)
    serial_no = models.CharField(max_length=100, blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    warranty_info = models.TextField(blank=True)
    location = models.CharField(max_length=100) # [cite: 18]
    
    # Ownership
    department = models.CharField(max_length=50, choices=[('production', 'Production'), ('it', 'IT')], default='production')
    
    # Responsibility [cite: 12]
    maintenance_team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True)
    default_technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_equipment')
    
    is_scrapped = models.BooleanField(default=False) # [cite: 74]

    def __str__(self):
        return self.name

# 4. Maintenance Request [cite: 25]
class Request(models.Model):
    subject = models.CharField(max_length=200) # [cite: 31]
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE) # [cite: 33]
    
    TYPE_CHOICES = (
        ('corrective', 'Corrective (Breakdown)'), # [cite: 28]
        ('preventive', 'Preventive (Routine)'),   # [cite: 29]
    )
    request_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='corrective')
    
    STAGE_CHOICES = (
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('repaired', 'Repaired'),
        ('scrap', 'Scrap'), # [cite: 55]
    )
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='new')
    
    scheduled_date = models.DateField(null=True, blank=True) # [cite: 34]
    duration = models.FloatField(default=0.0) # Hours spent [cite: 35]
    
    # Auto-filled or assigned
    assigned_team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True)
    assigned_technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tasks')

    def save(self, *args, **kwargs):
        # Auto-Fill Logic [cite: 40, 41]
        if not self.id and self.equipment:
            self.assigned_team = self.equipment.maintenance_team
            self.assigned_technician = self.equipment.default_technician
        
        # Scrap Logic [cite: 76]
        if self.stage == 'scrap' and self.equipment:
            self.equipment.is_scrapped = True
            self.equipment.save()
            
        super().save(*args, **kwargs)