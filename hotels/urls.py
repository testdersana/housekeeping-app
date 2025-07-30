from django.urls import path
from . import views

urlpatterns = [
    path('hotels/', views.HotelListCreateView.as_view(), name='hotel-list-create'),
    path('hotels/<int:pk>/', views.HotelDetailView.as_view(), name='hotel-detail'),
    path('hotels/<int:hotel_id>/room-types/', views.RoomTypeListCreateView.as_view(), name='roomtype-list-create'),
    path('hotels/<int:hotel_id>/room-types/<int:pk>/', views.RoomTypeDetailView.as_view(), name='roomtype-detail'),
    path('hotels/<int:hotel_id>/rooms/', views.RoomListCreateView.as_view(), name='room-list-create'),
    path('hotels/<int:hotel_id>/rooms/<int:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
    
    # Housekeeping endpoints
    path('hotels/<int:hotel_id>/housekeeping/rooms/', views.HotelRoomsWithStatusView.as_view(), name='hotel-rooms-with-status'),
    path('hotels/<int:hotel_id>/rooms/<int:room_id>/status/', views.update_room_status, name='update-room-status'),
    path('rooms/<int:room_id>/status/', views.RoomStatusListCreateView.as_view(), name='room-status-list-create'),
    path('rooms/<int:room_id>/status/<int:pk>/', views.RoomStatusDetailView.as_view(), name='room-status-detail'),
]