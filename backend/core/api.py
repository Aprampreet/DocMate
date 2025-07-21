from ninja import NinjaAPI, Router, File, Form
from ninja.files import UploadedFile
from .models import *
from .schemas import *
from auth_app.auth_backend import JWTAuth
from ninja import Query
from django.db.models import Q
from auth_app.api import auth_router
from typing import List
from ninja.errors import HttpError
from datetime import time,datetime,timedelta
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .ocr import *
import os
from .llm import *
from .tasks import send_email_async
api = NinjaAPI()
doctor_router = Router()
appointment_router = Router()
api.add_router("/", auth_router)
api.add_router('doctor/', doctor_router)
api.add_router("appointment/", appointment_router)


@doctor_router.post("/apply", auth=JWTAuth())
def apply_for_doctor(
    request,
    official_name:str = Form(...),
    specialization: str = Form(...),
    specialization1: str = Form(...),
    specialization2: Optional[str] = Form(None),
    specialization3: Optional[str] = Form(None),
    specialization4: Optional[str] = Form(None),
    experience: str = Form(...),
    education: str = Form(...),
    phone_number: str = Form(...),
    address: str = Form(...),
    about_you: str = Form(...),
    license_document: UploadedFile = File(...),
    doctor_profile_pic:UploadedFile = File(...)
):
    user = request.user

    if hasattr(user, 'doctor_application'):
        return {"error": "You already applied."}

    DoctorApplication.objects.create(
        user=user,
        official_name=official_name,
        specialization=specialization,
        specialization1=specialization1,
        specialization2=specialization2,
        specialization3=specialization3,
        specialization4=specialization4,
        experience=experience,
        education=education,
        phone_number=phone_number,
        address=address,
        about_you=about_you,
        license_document=license_document,
        doctor_profile_pic=doctor_profile_pic,
    )
    send_email_async.delay(
    subject='Application Submitted',
    message=f'Dear {user.full_name},\n\nYour application has been submitted successfully. Kindly wait for further notice.',
    recipient_email=user.email,
)


    return {"message": "Application submitted successfully."}


@doctor_router.get("/applications", response=List[DoctorApplicationOut], auth=JWTAuth())
def list_doctors_applications(request):
    if not request.user.is_staff:
        return 403, {"error": "You are not authorized."}

    applications = DoctorApplication.objects.select_related('user').all()

    return [
        DoctorApplicationOut(
            id=app.id,
            user_email=app.user.email,
            specialization=app.specialization,
            experience=app.experience,
            status=app.status,
        )
        for app in applications
    ]


@doctor_router.put("/applications/{app_id}/review", auth=JWTAuth())
def review_doctor_application(request, app_id: int, data: ApplicationReviewIn):
    if not request.user.is_staff:
        raise HttpError(403, "You are not authorized.")

    try:
        application = DoctorApplication.objects.select_related('user').get(id=app_id)
    except DoctorApplication.DoesNotExist:
        raise HttpError(404, "Application not found")

    if data.status not in ['approved', 'pending', 'rejected']:
        raise HttpError(400, "Invalid status")

    application.status = data.status
    application.remarks = data.remarks
    application.save()

    if data.status == 'rejected':
        send_email_async.delay(
            subject='Application Rejected',
            message=f'Dear {application.user.full_name},\n\nYour application has been rejected. It does not meet the required credentials.',
            recipient_email=application.user.email,
        )
        application.delete()

    elif data.status == 'approved':
        send_email_async.delay(
            subject='Application Approved',
            message=f'Dear {application.user.full_name},\n\nYour application has been approved. Welcome aboard, Dr. {application.user.full_name}!',
            recipient_email=application.user.email,
        )

    return {"message": f"Application {data.status} successfully"}



@doctor_router.get('/list', response=List[ApprovedDoctorOut])
def list_approved_doctors(request, search: Optional[str] = Query(None), specialization: Optional[str] = Query(None)):
    approved_profiles = DoctorProfile.objects.select_related('user').all()
    if search:
        approved_profiles = approved_profiles.filter(
            Q(official_name__icontains=search) |
            Q(user__full_name__icontains=search)
        )
    if specialization:
        approved_profiles = approved_profiles.filter(specialization__icontains=specialization)

    return [
        ApprovedDoctorOut(
            id=profile.id,  
            full_name=profile.user.full_name,
            name=profile.official_name,
            email=profile.user.email,
            specialization=profile.specialization,
            experience=profile.experience,
            profile_pic=request.build_absolute_uri(profile.doctor_profile_pic.url) if profile.doctor_profile_pic else None,
        )
        for profile in approved_profiles
    ]



@doctor_router.get("/detail/{doctor_id}", response=DoctorDetailOut, auth=JWTAuth())
def get_doctor_detail(request, doctor_id: int):
    try:
        profile = DoctorProfile.objects.select_related("user").get(id=doctor_id) 
        user = profile.user
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor profile not found")

    return {
        "id": user.id,
        "full_name": user.full_name,
        "official_name": profile.official_name,
        "email": user.email,
        "profile_pic": request.build_absolute_uri(profile.doctor_profile_pic.url) if profile.doctor_profile_pic else None,
        "specialization": profile.specialization,
        "specialization1": profile.specialization1,
        "specialization2": profile.specialization2,
        "specialization3": profile.specialization3,
        "specialization4": profile.specialization4,
        "experience": profile.experience,
        "education": profile.education,
        "address": profile.address,
        "about_you": profile.about_you,
        "patients_treated":profile.patients_treated,
        "bio": user.profile.bio if hasattr(user, 'profile') else "",
        "phone_number": profile.phone_number,
        "consultation_fee":profile.consultation_fee,
        "location": user.profile.location if hasattr(user, 'profile') else "",
        "rating": 4.0,
        "availabilities": [
            AvailabilityOut(
                day=a.day,
                start_time=a.start_time,
                end_time=a.end_time,
                is_off=a.is_off
            ) for a in profile.availabilities.all().order_by('day')
        ]
    }

@doctor_router.get("/doctor_profile", response=DoctorDetailOut, auth=JWTAuth())
def get_doctor_profile(request):
    user = request.user
    if not user.is_doctor:
        raise HttpError(403, "You are not authorized as a doctor")

    try:
        profile = DoctorProfile.objects.select_related("user").get(user=user)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor profile not found")

    return {
        "id": user.id,
        "full_name": user.full_name,
        "official_name": profile.official_name,
        "email": user.email,
        "profile_pic": request.build_absolute_uri(profile.doctor_profile_pic.url) if profile.doctor_profile_pic else None,
        "specialization": profile.specialization,
        "specialization1": profile.specialization1,
        "specialization2": profile.specialization2,
        "specialization3": profile.specialization3,
        "specialization4": profile.specialization4,
        "experience": profile.experience,
        "education": profile.education,
        "address": profile.address,
        "consultation_fee":profile.consultation_fee,
        "about_you": profile.about_you,
        "bio": getattr(user.profile, "bio", ""),  
        "phone_number": profile.phone_number,
        "patients_treated":profile.patients_treated,
        "location": getattr(user.profile, "location", ""),
        "rating": 4.0,
        "availabilities": [
            AvailabilityOut(
                day=a.day,
                start_time=a.start_time,
                end_time=a.end_time,
                is_off=a.is_off
            )
            for a in profile.availabilities.all()
        ]
    }


@doctor_router.put("/profile/update", auth=JWTAuth())
def update_doctor_profile(
    request,
    official_name: Optional[str] = Form(None),
    specialization: Optional[str] = Form(None),
    specialization1: Optional[str] = Form(None),
    specialization2: Optional[str] = Form(None),
    specialization3: Optional[str] = Form(None),
    specialization4: Optional[str] = Form(None),
    experience: Optional[str] = Form(None),
    education: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    about_you: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    consultation_fee:Optional[str] = Form(None),
    doctor_profile_pic: Optional[UploadedFile] = File(None)
):
    user = request.user

    if not user.is_doctor:
        raise HttpError(403, "Not authorized")

    try:
        profile = DoctorProfile.objects.get(user=user)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor profile not found")

    profile_fields = [
        "official_name", "specialization", "specialization1", "specialization2", "specialization3", "specialization4",
        "experience", "education", "phone_number", "address", "about_you", "bio",'consultation_fee'
    ]
    
    for field in profile_fields:
        value = locals()[field]
        if value is not None:
            setattr(profile, field, value)

    if doctor_profile_pic:
        profile.doctor_profile_pic.save(doctor_profile_pic.name, doctor_profile_pic)

    profile.save()
    return {"detail": "Doctor profile updated successfully"}

    


@doctor_router.put("/update_availabilities", auth=JWTAuth())
def update_availability(request, data: List[AvailabilityIn]):
    user = request.user
    if not user.is_doctor:
        raise HttpError(403, "Unauthorized")
    
    try:
        profile = DoctorProfile.objects.get(user=user)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor profile not found")

    for item in data:
        if not item.start_time or not item.end_time:
            item.is_off = True
        if not item.is_off and (not item.start_time or not item.end_time):
            raise HttpError(400, f"Start and End time must be provided for day: {item.day} if not marked off.")
        # Either update or create new for that day
        availability, _ = Availability.objects.update_or_create(
            doctor=profile,
            day=item.day,
            defaults={
                "start_time": item.start_time,
                "end_time": item.end_time,
                "is_off": item.is_off
            }
        )

    return {"detail": "Availabilities updated successfully"}



@appointment_router.post("/book", auth=JWTAuth(), response=AppointmentOut)
def book_appointment(request, data: AppointmentIn):
    user = request.user
    if user is None:
        raise HttpError(403, "Unauthorized")

    try:
        doctor = DoctorProfile.objects.get(id=data.doctor_id)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor not found")

    weekday = data.date.strftime("%A")
    availability = doctor.availabilities.filter(day__iexact=weekday).first()

    if not availability or availability.is_off:
        raise HttpError(400, f"Doctor is not available on {weekday}")

    input_time = data.time

    if not input_time:
        slot_time = availability.start_time
        while slot_time <= availability.end_time:
            if not Appointment.objects.filter(doctor=doctor, date=data.date, time=slot_time).exists():
                input_time = slot_time
                break
            slot_time = (datetime.combine(datetime.today(), slot_time) + timedelta(minutes=30)).time()
            

        if not input_time:
            raise HttpError(400, "No available slots on this date")

    if isinstance(input_time, str):
        try:
            input_time = datetime.strptime(input_time, "%H:%M").time()
        except ValueError:
            raise HttpError(400, "Invalid time format. Use HH:MM.")

    if not availability.start_time or not availability.end_time:
        raise HttpError(400, "Doctor's available time range is not configured.")

    if not (availability.start_time <= input_time <= availability.end_time):
        raise HttpError(400, "Selected time is outside doctor's available hours")

    if Appointment.objects.filter(doctor=doctor, date=data.date, time=input_time).exists():
        raise HttpError(400, "This slot is already booked")
    

    appointment = Appointment.objects.create(
        user=user,
        doctor=doctor,
        date=data.date,
        time=input_time,
        symptoms=data.symptoms,
        patient_email=data.patient_email,
        patient_phone=data.patient_phone,
        fee_paid=False,
        completed=False,
    )
    send_email_async.delay(
        subject='Appointment Booked Successfully',
        message=f'Dear {user.full_name},\n\nYour appointment with Dr. {doctor.official_name} has been booked successfully. We will notify you for any updates.',
        recipient_email=user.email,
    )

    send_email_async.delay(
        subject='New Appointment Scheduled',
        message=f'Dear Dr. {doctor.official_name},\n\nA new appointment has been scheduled by {user.full_name} for {appointment.date} at {appointment.time}. Please check your dashboard.',
        recipient_email=doctor.user.email,
    )

    return {
        "id": appointment.id,
        "doctor_name": doctor.official_name,
        "date": appointment.date,
        "time": appointment.time,
        "symptoms": appointment.symptoms,
        "status": appointment.status,
        "fee_paid": appointment.fee_paid,
        "completed": appointment.completed,
        "patient_email": appointment.patient_email,
        "patient_phone": appointment.patient_phone,
    }



    

   
@appointment_router.get("/list", response=List[AppointmentOut], auth=JWTAuth())
def get_user_appointments(request):
    user = request.user
    if user is None:
        raise HttpError(403, "Unauthorized")
    appointments = Appointment.objects.filter(user=user).select_related('user', 'doctor').order_by('-date', '-time')

    return [
        AppointmentOut(
            id=app.id,
            doctor_name=app.doctor.official_name,
            date=app.date,
            time=app.time,
            symptoms=app.symptoms,
            status=app.status,
            fee_paid=app.fee_paid,
            completed=app.completed,
            patient_email=app.patient_email,
            patient_phone=app.patient_phone
        )
        for app in appointments
    ]


@appointment_router.get('/doctor', response=List[AppointmentOut], auth=JWTAuth())
def get_doctors_appointment(request):
    user = request.user

    if not user.is_doctor:
        raise HttpError(403, "Only doctors can access their appointments")

    try:
        doctor_profile = DoctorProfile.objects.get(user=user)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor profile not found")

    appointments = Appointment.objects.filter(doctor=doctor_profile).select_related('user').order_by('-date', '-time')

    return [
        AppointmentOut(
            id=app.id,
            doctor_name=doctor_profile.official_name,
            date=app.date,
            time=app.time,
            symptoms=app.symptoms,
            status=app.status,
            fee_paid=app.fee_paid,
            completed=app.completed,
            patient_email=app.patient_email,
            patient_phone=app.patient_phone
        )
        for app in appointments
    ]



@appointment_router.put("/{appointment_id}/status", auth=JWTAuth())
def update_appointment_status(request, appointment_id: int, data: UpdateAppointmentStatusIn):
    user = request.user
    if not user.is_doctor:
        raise HttpError(403, "Only doctors can update appointment status")

    try:
        doctor_profile = DoctorProfile.objects.get(user=user)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor profile not found")

    try:
        appointment = Appointment.objects.select_related('user', 'doctor').get(id=appointment_id, doctor=doctor_profile)
    except Appointment.DoesNotExist:
        raise HttpError(404, "Appointment not found")

    if data.status not in ['confirmed', 'cancelled', 'completed']:
        raise HttpError(400, "Invalid status")

    appointment.status = data.status
    appointment.completed = (data.status == 'completed')
    appointment.save()

    patient = appointment.user
    doctor = appointment.doctor

    if data.status == 'cancelled':
        send_email_async.delay(
            subject='Appointment Cancelled ',
            message=f"Dear {patient.full_name},\n\nWe regret to inform you that your appointment with Dr. {doctor.official_name} on {appointment.date} at {appointment.time} has been cancelled.",
            recipient_email=patient.email,
        )
        send_email_async.delay(
            subject='Appointment Cancelled by You',
            message=f"Dear Dr. {doctor.official_name},\n\nYou have cancelled the appointment with {patient.full_name} scheduled for {appointment.date} at {appointment.time}.",
            recipient_email=doctor.user.email,
        )

    elif data.status == 'confirmed':
        send_email_async.delay(
            subject='Appointment Confirmed ',
            message=f"Dear {patient.full_name},\n\nYour appointment with Dr. {doctor.official_name} on {appointment.date} at {appointment.time} has been confirmed.",
            recipient_email=patient.email,
        )
        send_email_async.delay(
            subject='Appointment Confirmed',
            message=f"Dear Dr. {doctor.official_name},\n\nYou have confirmed the appointment with {patient.full_name} for {appointment.date} at {appointment.time}.",
            recipient_email=doctor.user.email,
        )

    elif data.status == 'completed':
        send_email_async.delay(
            subject='Appointment Completed ',
            message=f"Dear {patient.full_name},\n\nYour appointment with Dr. {doctor.official_name} on {appointment.date} at {appointment.time} has been marked as completed. Thank you for using DocMate.",
            recipient_email=patient.email,
        )
        send_email_async.delay(
            subject='Appointment Marked as Completed',
            message=f"Dear Dr. {doctor.official_name},\n\nThe appointment with {patient.full_name} on {appointment.date} at {appointment.time} has been marked as completed.",
            recipient_email=doctor.user.email,
        )

    return {"detail": f"Appointment marked as {data.status}"}



@appointment_router.post("/report-scan", response=ReportScanPublicResponse, auth=JWTAuth())
def create_report_scan(request, image: UploadedFile):
    path = default_storage.save(f'reports/{image.name}', ContentFile(image.read()))
    full_path = os.path.join(settings.MEDIA_ROOT, path)

    extracted_report = extract_text_from_image(full_path)
    print("Extracted Report:", extracted_report)

    report_info = get_report_info(extracted_report)
    print('QROQ response: ', report_info)

    raw_specializations = report_info.get("doctor_specialization")
    if not isinstance(raw_specializations, list):
        raw_specializations = [raw_specializations or "General Physician"]

    report_obj = ReportScan.objects.create(
        user=request.user,
        image=path,
        report_test_name=report_info.get("report_test_name") or "Unknown",
        extracted_report=extracted_report or "No text extracted.",
        symptoms=report_info.get("symptoms") or "No symptoms found.",
        precautions=report_info.get("precautions") or "No precautions provided.",
        emergency=report_info.get("emergency") or "Normal",
        recommended_specializations=", ".join(raw_specializations)
    )

    return {
        "report_test_name": report_obj.report_test_name,
        "symptoms": report_obj.symptoms,
        "precautions": report_obj.precautions,
        "emergency": report_obj.emergency,
        "recommended_specializations": raw_specializations
    }



@appointment_router.get("/doctors-by-specialization", response=List[ApprovedDoctorOut], auth=JWTAuth())
def get_doctors_by_specialization(request, specialization: str):
    doctors = DoctorProfile.objects.filter(
        models.Q(specialization__icontains=specialization) |
        models.Q(specialization1__icontains=specialization) |
        models.Q(specialization2__icontains=specialization) |
        models.Q(specialization3__icontains=specialization) |
        models.Q(specialization4__icontains=specialization)
    )

    return [
        ApprovedDoctorOut(
            id=doc.id,
            full_name=doc.user.full_name,
            name=doc.official_name or doc.user.full_name,
            email=doc.user.email,
            specialization=doc.specialization,
            experience=doc.experience,
            profile_pic=doc.doctor_profile_pic.url if doc.doctor_profile_pic else None
        )
        for doc in doctors
    ]


@appointment_router.post("/submit-review", response={200: dict, 403: dict, 400: dict},auth=JWTAuth())
def submit_doctor_review(request, data: ReviewIn):
    try:
        doctor = DoctorProfile.objects.get(id=data.doctor_id)
    except DoctorProfile.DoesNotExist:
        return 400, {"message": "Doctor does not exist."}

    has_completed_appointment = Appointment.objects.filter(
        user=request.user,
        doctor=doctor,
        completed=True
    ).exists()

    if not has_completed_appointment:
        return 403, {"message": "You can only review a doctor after completing an appointment."}

    if DoctorReview.objects.filter(user=request.user, doctor=doctor).exists():
        return 400, {"message": "You have already reviewed this doctor."}

    DoctorReview.objects.create(
        user=request.user,
        doctor=doctor,
        rating=data.rating,
        comment=data.comment or ""
    )

    return 200, {"message": "Review submitted successfully."}


@appointment_router.get("/doctor-reviews/{doctor_id}", response=dict,auth=JWTAuth())
def get_doctor_reviews(request, doctor_id: int):
    try:
        doctor = DoctorProfile.objects.get(id=doctor_id)
    except DoctorProfile.DoesNotExist:
        raise HttpError(404, "Doctor not found.")

    reviews_qs = DoctorReview.objects.filter(doctor=doctor).order_by("-created_at")

    reviews = [
        ReviewOut(
            user_name=review.user.full_name,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at.strftime("%Y-%m-%d %H:%M")
        ) for review in reviews_qs
    ]

    has_appointment = Appointment.objects.filter(
        user=request.user,
        doctor=doctor,
        completed=True
    ).exists()

    return {
        "reviews": reviews,
        "has_appointment": has_appointment
    }
