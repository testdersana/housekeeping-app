import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HotelService, Hotel } from '../../services/hotel';

@Component({
  selector: 'app-hotel-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './hotel-list.html',
  styleUrl: './hotel-list.css'
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = false;
  error: string | null = null;

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.loading = true;
    this.error = null;
    
    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load hotels';
        this.loading = false;
        console.error('Error loading hotels:', error);
      }
    });
  }

  deleteHotel(hotel: Hotel) {
    if (confirm(`Are you sure you want to delete ${hotel.name}?`)) {
      this.hotelService.deleteHotel(hotel.id!).subscribe({
        next: () => {
          this.loadHotels();
        },
        error: (error) => {
          this.error = 'Failed to delete hotel';
          console.error('Error deleting hotel:', error);
        }
      });
    }
  }
}
