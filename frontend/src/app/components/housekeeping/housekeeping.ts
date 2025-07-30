import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface RoomStatus {
  status: string;
  occupancy_status: string;
  status_date: string;
}

interface Room {
  id: number;
  room_number: string;
  room_type: number;
  room_type_name: string;
  current_status: RoomStatus;
}

@Component({
  selector: 'app-housekeeping',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './housekeeping.html',
  styleUrl: './housekeeping.css'
})
export class HousekeepingComponent implements OnInit {
  hotelId: number | null = null;
  rooms: Room[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      if (params['id']) {
        this.hotelId = +params['id'];
        this.loadRooms();
      }
    });
  }

  loadRooms() {
    if (!this.hotelId) return;
    
    this.loading = true;
    this.error = null;
    
    this.http.get<Room[]>(`/api/hotels/${this.hotelId}/housekeeping/rooms/`)
      .subscribe({
        next: (data) => {
          this.rooms = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading rooms:', err);
          this.error = err.message || 'Failed to load rooms';
          this.loading = false;
        }
      });
  }

  updateRoomStatus(roomId: number, status: string) {
    if (!this.hotelId) return;
    
    this.http.post(`/api/hotels/${this.hotelId}/rooms/${roomId}/status/`, { status })
      .subscribe({
        next: () => {
          this.loadRooms(); // Reload rooms after update
        },
        error: (err) => {
          console.error('Error updating room status:', err);
          this.error = err.message || 'Failed to update room status';
        }
      });
  }
}