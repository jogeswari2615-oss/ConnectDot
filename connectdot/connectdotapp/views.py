from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from .serializers import EnrollmentSerializer, JobApplicationSerializer


# ✅ API test
def api_home(request):
    return JsonResponse({"message": "API working"})


# ✅ ENROLL
@api_view(['POST'])
def enroll_course(request):
    serializer = EnrollmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user_id=1)
        return Response({"message": "Enrolled successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ APPLY JOB  (IMPORTANT FIX)
@api_view(['POST'])
def apply_job(request):
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user_id=1)
        return Response({"message": "Application submitted!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ REGISTER
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


# ✅ LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        return Response({"message": "Login successful", "user_id": user.id})
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)