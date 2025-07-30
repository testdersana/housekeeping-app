from rest_framework import serializers
from .models import Hotel, RoomType, Room, RoomStatus
from django.utils import timezone

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'name', 'code', 'max_occupancy', 'created_at', 'updated_at']

class RoomStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomStatus
        fields = ['id', 'room', 'status_date', 'status', 'occupancy_status', 'notes', 'created_at', 'updated_at']

class RoomSerializer(serializers.ModelSerializer):
    room_type_name = serializers.CharField(source='room_type.name', read_only=True)
    room_type_code = serializers.CharField(source='room_type.code', read_only=True)
    
    class Meta:
        model = Room
        fields = ['id', 'room_number', 'room_type', 'room_type_name', 'room_type_code', 'created_at', 'updated_at']

class RoomWithStatusSerializer(serializers.ModelSerializer):
    room_type_name = serializers.CharField(source='room_type.name', read_only=True)
    current_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = ['id', 'room_number', 'room_type', 'room_type_name', 'current_status']
    
    def get_current_status(self, obj):
        today = timezone.now().date()
        status = obj.statuses.filter(status_date=today).first()
        if not status:
            # Create a default status if none exists for today
            status = RoomStatus(
                room=obj,
                status_date=today,
                status='INSPECTED',
                occupancy_status='VACANT'
            )
            status.save()
        
        return {
            'status': status.status,
            'occupancy_status': status.occupancy_status,
            'status_date': status.status_date
        }

class HotelSerializer(serializers.ModelSerializer):
    room_types = RoomTypeSerializer(many=True, read_only=True)
    rooms = RoomSerializer(many=True, read_only=True)
    
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'identification_code', 'address', 'room_types', 'rooms', 'created_at', 'updated_at']

class HotelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'identification_code', 'address']