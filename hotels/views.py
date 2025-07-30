from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
from .models import Hotel, RoomType, Room, RoomStatus
from .serializers import (
    HotelSerializer, HotelListSerializer, RoomTypeSerializer, 
    RoomSerializer, RoomStatusSerializer, RoomWithStatusSerializer
)

class HotelListCreateView(generics.ListCreateAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelListSerializer

class HotelDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

class RoomTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomTypeSerializer
    
    def get_queryset(self):
        hotel_id = self.kwargs.get('hotel_id')
        return RoomType.objects.filter(hotel_id=hotel_id)
    
    def perform_create(self, serializer):
        hotel_id = self.kwargs.get('hotel_id')
        serializer.save(hotel_id=hotel_id)

class RoomTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomTypeSerializer
    
    def get_queryset(self):
        hotel_id = self.kwargs.get('hotel_id')
        return RoomType.objects.filter(hotel_id=hotel_id)

class RoomListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        hotel_id = self.kwargs.get('hotel_id')
        return Room.objects.filter(hotel_id=hotel_id).select_related('room_type')
    
    def perform_create(self, serializer):
        hotel_id = self.kwargs.get('hotel_id')
        serializer.save(hotel_id=hotel_id)

class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomSerializer
    
    def get_queryset(self):
        hotel_id = self.kwargs.get('hotel_id')
        return Room.objects.filter(hotel_id=hotel_id).select_related('room_type')

class HotelRoomsWithStatusView(generics.ListAPIView):
    serializer_class = RoomWithStatusSerializer
    
    def get_queryset(self):
        hotel_id = self.kwargs.get('hotel_id')
        return Room.objects.filter(hotel_id=hotel_id).select_related('room_type')

class RoomStatusListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomStatusSerializer
    
    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        return RoomStatus.objects.filter(room_id=room_id)
    
    def perform_create(self, serializer):
        room_id = self.kwargs.get('room_id')
        serializer.save(room_id=room_id)

class RoomStatusDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomStatusSerializer
    
    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        return RoomStatus.objects.filter(room_id=room_id)

@api_view(['POST'])
def update_room_status(request, hotel_id, room_id):
    try:
        room = Room.objects.get(id=room_id, hotel_id=hotel_id)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    
    today = timezone.now().date()
    
    # Get or create today's status
    room_status, created = RoomStatus.objects.get_or_create(
        room=room,
        status_date=today,
        defaults={
            'status': 'INSPECTED',
            'occupancy_status': 'VACANT'
        }
    )
    
    # Update with request data
    if 'status' in request.data:
        room_status.status = request.data['status']
    
    if 'occupancy_status' in request.data:
        room_status.occupancy_status = request.data['occupancy_status']
    
    if 'notes' in request.data:
        room_status.notes = request.data['notes']
    
    room_status.save()
    
    serializer = RoomStatusSerializer(room_status)
    return Response(serializer.data)
