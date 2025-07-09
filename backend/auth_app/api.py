from .schemas import *
from .models import *
from ninja.router import Router
from typing import List
from django.contrib.auth import get_user_model,authenticate
from ninja.security import django_auth
from auth_app.auth_backend import JWTAuth
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from ninja import Form, File
from ninja.files import UploadedFile


auth_router = Router()
User = get_user_model()

@auth_router.post("/register")
def register_user(request,data:RegisterSchema):
    if CustomUser.objects.filter(email=data.email).exists():
        return {"error": "User with this email already exists."}
    CustomUser.objects.create_user(
        email=data.email,
        full_name=data.full_name,
        password=data.password,
        is_doctor=data.is_doctor,
    )

    return {"message": "User registered successfully."}


@auth_router.get("/users", response=List[UserOut], auth=JWTAuth())
def get_all_users(request):
    if not request.user.is_superuser:
        return 403, {"error": "You are not authorized to view this."}

    users = User.objects.all()
    return users



@auth_router.post("/login", response={200: TokenOut, 401: dict})
def login_user(request, data: LoginSchema):
    user = authenticate(request, email=data.email, password=data.password)

    if not user:
        return 401, {"detail": "Invalid email or password"}

    refresh = RefreshToken.for_user(user)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "full_name": user.full_name,
        "is_doctor": user.is_doctor,
    }

@auth_router.get("/me", response=UserOut, auth=JWTAuth())
def get_logged_in_user(request):
    user = request.user
    if user.is_anonymous:
        raise AuthenticationFailed("User is not authenticated")

    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_doctor=user.is_doctor,
    )


@auth_router.get('/profile', response=ProfileOut, auth=JWTAuth())
def get_profile(request):
    user = request.user
    profile = user.profile
    return {
        "full_name": user.full_name,
        "email": user.email,
        "profile_pic": request.build_absolute_uri(profile.profile_pic.url) if profile.profile_pic else None,
        "dob": profile.dob,
        "location": profile.location,
        "phone_number": profile.phone_number, 
        "gender": profile.gender, 
        "bio": profile.bio,
    }

@auth_router.put("/profile", response=ProfileOut, auth=JWTAuth())
def update_profile(
    request,
    dob: Optional[date] = Form(None),
    location: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),  
    profile_pic: Optional[UploadedFile] = File(None),
):
    profile = request.user.profile

    updates = {
        "dob": dob,
        "location": location,
        "phone_number": phone_number,
        "bio": bio,
        "gender": gender,
    }
    for attr, value in updates.items():
        if value is not None:
            setattr(profile, attr, value)

    if profile_pic:
        profile.profile_pic.save(profile_pic.name, profile_pic)

    profile.save()

    return {
        "full_name": request.user.full_name,
        "email": request.user.email,
        "profile_pic": request.build_absolute_uri(profile.profile_pic.url) if profile.profile_pic else None,
        "dob": profile.dob,
        "location": profile.location,
        "phone_number": profile.phone_number,
        "gender": profile.gender,
        "bio": profile.bio,
    }
