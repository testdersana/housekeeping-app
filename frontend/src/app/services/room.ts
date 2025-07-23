import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id?: number;
  room_number: string;
  room_type: number;
  room_type_name?: string;
  room_type_code?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private baseUrl = 'http://localhost:12000/api';

  constructor(private http: HttpClient) {}

  getRooms(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/hotels/${hotelId}/rooms/`);
  }

  createRoom(hotelId: number, room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.baseUrl}/hotels/${hotelId}/rooms/`, room);
  }

  updateRoom(hotelId: number, roomId: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/hotels/${hotelId}/rooms/${roomId}/`, room);
  }

  deleteRoom(hotelId: number, roomId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hotels/${hotelId}/rooms/${roomId}/`);
  }
}