from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Hotel, RoomType, Room
from .serializers import HotelSerializer, HotelListSerializer, RoomTypeSerializer, RoomSerializer

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
