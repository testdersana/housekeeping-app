import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HotelService, Hotel, RoomType } from '../../services/hotel';

@Component({
  selector: 'app-room-type-setup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-type-setup.html',
  styleUrl: './room-type-setup.css'
})
export class RoomTypeSetupComponent implements OnInit {
  hotel: Hotel | null = null;
  roomTypes: RoomType[] = [];
  roomTypeForm: FormGroup;
  hotelId: number | null = null;
  loading = false;
  error: string | null = null;
  editingRoomType: RoomType | null = null;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roomTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(1)]],
      max_occupancy: ['', [Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.hotelId = +params['id'];
        this.loadHotel();
        this.loadRoomTypes();
      }
    });
  }

  loadHotel() {
    if (this.hotelId) {
      this.hotelService.getHotel(this.hotelId).subscribe({
        next: (hotel) => {
          this.hotel = hotel;
        },
        error: (error) => {
          this.error = 'Failed to load hotel';
          console.error('Error loading hotel:', error);
        }
      });
    }
  }

  loadRoomTypes() {
    if (this.hotelId) {
      this.loading = true;
      this.hotelService.getRoomTypes(this.hotelId).subscribe({
        next: (roomTypes) => {
          this.roomTypes = roomTypes;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load room types';
          this.loading = false;
          console.error('Error loading room types:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.roomTypeForm.valid && this.hotelId) {
      this.loading = true;
      this.error = null;
      
      const roomTypeData: RoomType = this.roomTypeForm.value;
      
      const operation = this.editingRoomType 
        ? this.hotelService.updateRoomType(this.hotelId, this.editingRoomType.id!, roomTypeData)
        : this.hotelService.createRoomType(this.hotelId, roomTypeData);

      operation.subscribe({
        next: () => {
          this.roomTypeForm.reset();
          this.editingRoomType = null;
          this.loadRoomTypes();
        },
        error: (error) => {
          this.error = this.editingRoomType ? 'Failed to update room type' : 'Failed to create room type';
          this.loading = false;
          console.error('Error saving room type:', error);
        }
      });
    }
  }

  editRoomType(roomType: RoomType) {
    this.editingRoomType = roomType;
    this.roomTypeForm.patchValue(roomType);
  }

  cancelEdit() {
    this.editingRoomType = null;
    this.roomTypeForm.reset();
  }

  deleteRoomType(roomType: RoomType) {
    if (confirm(`Are you sure you want to delete room type ${roomType.name}?`)) {
      this.hotelService.deleteRoomType(this.hotelId!, roomType.id!).subscribe({
        next: () => {
          this.loadRoomTypes();
        },
        error: (error) => {
          this.error = 'Failed to delete room type';
          console.error('Error deleting room type:', error);
        }
      });
    }
  }

  backToHotels() {
    this.router.navigate(['/hotels']);
  }

  goToRooms() {
    this.router.navigate(['/hotels', this.hotelId, 'rooms']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.roomTypeForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.replace('_', ' ')} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${fieldName.replace('_', ' ')} must be at least ${field.errors['min'].min}`;
      }
    }
    return null;
  }
}
