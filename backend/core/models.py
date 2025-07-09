from django.db import models
from django.conf import settings

class DoctorApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    official_name = models.CharField(max_length=100,blank=True,null=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_application')
    license_document = models.FileField(upload_to='doctor_licenses/')
    doctor_profile_pic=models.FileField(upload_to='doc_profile_pic/',default='default.png')
    specialization = models.TextField()
    experience = models.CharField(max_length=100)
    education = models.CharField(max_length=1000, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    specialization1 = models.CharField(max_length=200, blank=True, null=True)
    specialization2 = models.CharField(max_length=200, null=True, blank=True)
    specialization3 = models.CharField(max_length=200, null=True, blank=True)
    specialization4 = models.CharField(max_length=200, null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    remarks = models.TextField(blank=True, null=True)
    about_you = models.TextField(blank=True, null=True)
    

    def __str__(self):
        return f"{self.user.full_name} - {self.status}"


class DoctorProfile(models.Model):
    official_name = models.CharField(max_length=100,blank=True,null=True)
    doctor_profile_pic=models.FileField(upload_to='doc_profile_pic_profile/',blank=True,null=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_profile")
    application = models.OneToOneField("DoctorApplication", on_delete=models.CASCADE)
    specialization = models.TextField()
    specialization1 = models.CharField(max_length=200)
    specialization2 = models.CharField(max_length=200, null=True, blank=True)
    specialization3 = models.CharField(max_length=200, null=True, blank=True)
    specialization4 = models.CharField(max_length=200, null=True, blank=True)
    experience = models.CharField(max_length=100)
    education = models.CharField(max_length=1000)
    phone_number = models.CharField(max_length=15)
    address = models.CharField(max_length=500)
    about_you = models.TextField()
    consultation_fee = models.DecimalField(
        max_digits=8, decimal_places=2, default=0.00, help_text="Fee in INR"
    )
    patients_treated = models.IntegerField(default=0)

    def __str__(self):
        return f"Doctor Profile: {self.user.full_name}"


class Availability(models.Model):
    DAYS = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    doctor = models.ForeignKey("DoctorProfile", on_delete=models.CASCADE, related_name="availabilities")
    day = models.CharField(max_length=10, choices=DAYS)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    is_off = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.doctor.user.full_name} - {self.day}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_appointments')  
    date = models.DateField()
    patient_email	= models.CharField(max_length=200)
    patient_phone = models.CharField(max_length=15)
    time = models.TimeField()
    symptoms = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    fee_paid = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment of {self.user} with Dr. {self.doctor.user} on {self.date} at {self.time}"


class ReportScan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='reports/')
    extracted_report = models.TextField()
    report_test_name = models.CharField(max_length=255)
    symptoms = models.TextField()
    precautions = models.TextField()
    emergency = models.CharField(max_length=50)
    recommended_specializations = models.TextField(help_text="Comma separated specializations")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report: {self.report_test_name} - {self.user.email}"