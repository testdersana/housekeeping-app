import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HotelService, Hotel } from '../../services/hotel';

@Component({
  selector: 'app-hotel-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-form.html',
  styleUrl: './hotel-form.css'
})
export class HotelFormComponent implements OnInit {
  hotelForm: FormGroup;
  isEditMode = false;
  hotelId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.hotelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      identification_code: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.hotelId = +params['id'];
        this.loadHotel();
      }
    });
  }

  loadHotel() {
    if (this.hotelId) {
      this.loading = true;
      this.hotelService.getHotel(this.hotelId).subscribe({
        next: (hotel) => {
          this.hotelForm.patchValue(hotel);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load hotel';
          this.loading = false;
          console.error('Error loading hotel:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      this.loading = true;
      this.error = null;
      
      const hotelData: Hotel = this.hotelForm.value;
      
      const operation = this.isEditMode 
        ? this.hotelService.updateHotel(this.hotelId!, hotelData)
        : this.hotelService.createHotel(hotelData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/hotels']);
        },
        error: (error) => {
          this.error = this.isEditMode ? 'Failed to update hotel' : 'Failed to create hotel';
          this.loading = false;
          console.error('Error saving hotel:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/hotels']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.hotelForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.replace('_', ' ')} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }
}
