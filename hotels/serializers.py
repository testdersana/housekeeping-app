from rest_framework import serializers
from .models import Hotel, RoomType, Room

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'name', 'code', 'max_occupancy', 'created_at', 'updated_at']

class RoomSerializer(serializers.ModelSerializer):
    room_type_name = serializers.CharField(source='room_type.name', read_only=True)
    room_type_code = serializers.CharField(source='room_type.code', read_only=True)
    
    class Meta:
        model = Room
        fields = ['id', 'room_number', 'room_type', 'room_type_name', 'room_type_code', 'created_at', 'updated_at']

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