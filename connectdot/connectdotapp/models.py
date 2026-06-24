from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

class JobApplication(models.Model):
    JOB_TYPES = [('India', 'India'), ('Abroad', 'Abroad')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location_type = models.CharField(max_length=10, choices=JOB_TYPES)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Pending")
