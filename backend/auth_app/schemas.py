from ninja import Schema
from typing import Optional
from datetime import date

class RegisterSchema(Schema):
    email: str
    full_name: str
    password: str
    is_doctor: bool = False

class LoginSchema(Schema):
    email: str
    password: str

class UserOut(Schema):
    id: int
    email: str
    full_name: str
    is_doctor: bool

class LoginSchema(Schema):
    email: str
    password: str

class TokenOut(Schema):
    access: str
    refresh: str
    full_name: str
    is_doctor: bool

class ProfileOut(Schema):
    full_name: str
    email: str
    profile_pic: Optional[str]
    dob: Optional[date]
    location: Optional[str]
    phone_number : Optional[str]
    gender: Optional[str]  
    bio: Optional[str]

class ProfileUpdate(Schema):
    dob: Optional[date]
    location: Optional[str]
    phone_number : Optional[str]
    gender: Optional[str]  
    bio: Optional[str]