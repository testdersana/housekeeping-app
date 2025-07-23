from django.urls import path
from . import views

urlpatterns = [
    path('hotels/', views.HotelListCreateView.as_view(), name='hotel-list-create'),
    path('hotels/<int:pk>/', views.HotelDetailView.as_view(), name='hotel-detail'),
    path('hotels/<int:hotel_id>/room-types/', views.RoomTypeListCreateView.as_view(), name='roomtype-list-create'),
    path('hotels/<int:hotel_id>/room-types/<int:pk>/', views.RoomTypeDetailView.as_view(), name='roomtype-detail'),
    path('hotels/<int:hotel_id>/rooms/', views.RoomListCreateView.as_view(), name='room-list-create'),
    path('hotels/<int:hotel_id>/rooms/<int:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
]