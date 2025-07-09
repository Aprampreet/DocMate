from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import DoctorApplication, DoctorProfile, Availability
from datetime import time

@receiver(post_save, sender=DoctorApplication)
def create_doctor_profile_and_availability(sender, instance, created, **kwargs):
    if instance.status != 'approved':
        return

    user = instance.user

    if hasattr(user, 'doctor_profile'):
        return

    doctor_profile = DoctorProfile.objects.create(
        user=user,
        application=instance,
        specialization=instance.specialization,
        specialization1=instance.specialization1,
        specialization2=instance.specialization2,
        specialization3=instance.specialization3,
        specialization4=instance.specialization4,
        experience=instance.experience,
        education=instance.education,
        phone_number=instance.phone_number,
        address=instance.address,
        about_you=instance.about_you,
        doctor_profile_pic=instance.doctor_profile_pic,
        official_name=instance.official_name
    )

    # Add availability for all days
    for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']:
        Availability.objects.create(
            doctor=doctor_profile,
            day=day,
            start_time=time(9, 0),
            end_time=time(17, 0),
            is_off=False,
        )

    # Set user as doctor
    user.is_doctor = True
    user.save()
