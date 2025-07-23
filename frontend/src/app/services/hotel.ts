import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id?: number;
  name: string;
  identification_code: string;
  address: string;
  room_types?: RoomType[];
  created_at?: string;
  updated_at?: string;
}

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
export class HotelService {

  private apiUrl = 'https://work-1-xvehiwegmxwpmtad.prod-runtime.all-hands.dev/api';

  constructor(private http: HttpClient) { }

  // Hotel methods
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels/`);
  }

  getHotel(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}/`);
  }

  createHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.apiUrl}/hotels/`, hotel);
  }

  updateHotel(id: number, hotel: Hotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/hotels/${id}/`, hotel);
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hotels/${id}/`);
  }

  // Room Type methods
  getRoomTypes(hotelId: number): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.apiUrl}/hotels/${hotelId}/room-types/`);
  }

  createRoomType(hotelId: number, roomType: RoomType): Observable<RoomType> {
    return this.http.post<RoomType>(`${this.apiUrl}/hotels/${hotelId}/room-types/`, roomType);
  }

  updateRoomType(hotelId: number, id: number, roomType: RoomType): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.apiUrl}/hotels/${hotelId}/room-types/${id}/`, roomType);
  }

  deleteRoomType(hotelId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hotels/${hotelId}/room-types/${id}/`);
  }
}
