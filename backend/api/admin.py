from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Equipment, Team, Request

# 1. Configure the User Admin to show the 'role' field
class CustomUserAdmin(UserAdmin):
    model = User
    # Columns to show in the list of users
    list_display = ['username', 'email', 'role', 'is_staff']
    
    # Fields to show when editing a user
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Roles', {'fields': ('role',)}),
    )
    
    # Fields to show when creating a new user
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Roles', {'fields': ('role',)}),
    )

# 2. Register your models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Equipment)
admin.site.register(Team)
admin.site.register(Request)