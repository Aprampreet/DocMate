from ninja import Schema
from ninja.schema import BaseModel
from typing import Optional, List
from datetime import time,date
from ninja.files import UploadedFile
from ninja import File, Form

class DoctorApplicationIn(Schema):
    specialization: str
    experience: str
    education: str
    phone_number: str
    address: str
    specialization1: str
    specialization2: Optional[str]
    specialization3: Optional[str]
    specialization4: Optional[str]
    about_you: str

class DoctorApplicationOut(Schema):
    id: int
    user_email: str
    specialization: str
    experience: str
    status: str

class ApplicationReviewIn(Schema):
    status: str
    remarks: Optional[str] = None

class ApprovedDoctorOut(Schema):
    id: int
    full_name: str
    name: str  
    email: str
    specialization: str
    experience: str
    profile_pic: Optional[str]


class AvailabilityOut(Schema):
    day: str
    start_time: Optional[time]
    end_time: Optional[time]
    is_off: bool

class DoctorDetailOut(Schema):
    id: int
    full_name: str
    official_name: str
    email: str
    profile_pic: Optional[str]
    specialization: str
    specialization1: str
    specialization2: str
    specialization3: str
    specialization4: str
    consultation_fee:Optional[float]
    experience: str
    bio: Optional[str]
    phone_number: Optional[str]
    location: Optional[str]
    education: str
    address: str
    about_you: str
    rating: Optional[float] = 4.0
    availabilities: List[AvailabilityOut]
    patients_treated:Optional[int]

class AvailabilityIn(Schema):
    day: str
    start_time: Optional[time]
    end_time: Optional[time]
    is_off: bool

class AppointmentIn(Schema):
    doctor_id: int
    date: date
    time: time
    symptoms: str
    patient_email: str
    patient_phone: str

class AppointmentOut(Schema):
    id: int
    doctor_name: str
    date: date
    time: time
    symptoms: str
    status: str
    fee_paid: bool
    completed : Optional[bool]
    patient_email: str
    patient_phone: str


class UpdateAppointmentStatusIn(BaseModel):
    status: str

class ReportScanPublicResponse(Schema):
    report_test_name: str
    symptoms: str
    precautions: str
    emergency: str
    recommended_specializations: List[str]

class ReportScanHistoryResponse(Schema):
    id: int
    image_url: str
    report_test_name: str
    emergency: str
    created_at: str

class ReviewIn(Schema):
    doctor_id: int
    rating: int
    comment: Optional[str]

class ReviewOut(Schema):
    user_name: str
    rating: int
    comment: str
    created_at: str