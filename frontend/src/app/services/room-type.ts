import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomType {
  id?: number;
  name: string;
  code: string;
  max_occupancy?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {
  private baseUrl = 'http://localhost:12000/api';

  constructor(private http: HttpClient) {}

  getRoomTypes(hotelId: number): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.baseUrl}/hotels/${hotelId}/room-types/`);
  }

  createRoomType(hotelId: number, roomType: RoomType): Observable<RoomType> {
    return this.http.post<RoomType>(`${this.baseUrl}/hotels/${hotelId}/room-types/`, roomType);
  }

  updateRoomType(hotelId: number, roomTypeId: number, roomType: RoomType): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.baseUrl}/hotels/${hotelId}/room-types/${roomTypeId}/`, roomType);
  }

  deleteRoomType(hotelId: number, roomTypeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hotels/${hotelId}/room-types/${roomTypeId}/`);
  }
}