from ninja.security import HttpBearer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        print("Token received in authenticate():", token)
        try:
            validated_token = JWTAuthentication().get_validated_token(token)
            user = JWTAuthentication().get_user(validated_token)
            print("User fetched:", user)

            if not user or not user.is_authenticated:
                raise AuthenticationFailed("User not authenticated")
            
            request.user = user
            return user
        except Exception as e:
            print("JWT ERROR:", str(e))
            raise AuthenticationFailed("Token is invalid or expired")
