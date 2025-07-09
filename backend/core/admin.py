from django.contrib import admin
from .models import *

@admin.register(DoctorApplication)
class DoctorApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'submitted_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'user__full_name')

admin.site.register(DoctorProfile)   
admin.site.register(Availability) 
admin.site.register(Appointment) 
admin.site.register(ReportScan)