from rest_framework import serializers
from .models import Course, Enrollment, JobApplication

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    # This keeps accepting the course text from React
    course = serializers.CharField()

    class Meta:
        model = Enrollment
        fields = '__all__'

    def create(self, validated_data):
        # Extract the course string sent by the frontend
        course_name = validated_data.pop('course')
        
        # FIXED: Using 'title' instead of 'course_name' to match your actual database column!
        course_instance, _ = Course.objects.get_or_create(title=course_name)
        
        # Save the enrollment with the correct course database instance
        enrollment = Enrollment.objects.create(course=course_instance, **validated_data)
        return enrollment

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'