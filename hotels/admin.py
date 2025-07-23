from django.contrib import admin
from .models import Hotel, RoomType, Room

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'identification_code', 'address', 'created_at']
    search_fields = ['name', 'identification_code']
    list_filter = ['created_at']

@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'hotel', 'max_occupancy', 'created_at']
    search_fields = ['name', 'code', 'hotel__name']
    list_filter = ['hotel', 'created_at']

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'hotel', 'room_type', 'created_at']
    search_fields = ['room_number', 'hotel__name', 'room_type__name']
    list_filter = ['hotel', 'room_type', 'created_at']
