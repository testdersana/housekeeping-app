from django.db import models

class Hotel(models.Model):
    name = models.CharField(max_length=200)
    identification_code = models.CharField(max_length=50, unique=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class RoomType(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='room_types')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    max_occupancy = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.hotel.name} - {self.name}"

    class Meta:
        ordering = ['hotel', 'name']
        unique_together = ['hotel', 'code']

class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.ForeignKey(RoomType, on_delete=models.CASCADE, related_name='rooms')
    room_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.hotel.name} - Room {self.room_number}"

    class Meta:
        ordering = ['hotel', 'room_number']
        unique_together = ['hotel', 'room_number']
