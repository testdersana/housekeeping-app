import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService, Room } from '../../services/room';
import { RoomTypeService, RoomType } from '../../services/room-type';
import { HotelService, Hotel } from '../../services/hotel';

@Component({
  selector: 'app-room-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-management.html',
  styleUrl: './room-management.css'
})
export class RoomManagement implements OnInit {
  hotelId!: number;
  hotel = signal<Hotel | null>(null);
  rooms = signal<Room[]>([]);
  roomTypes = signal<RoomType[]>([]);
  filteredRooms = signal<Room[]>([]);
  selectedRoomType = signal<string>('');
  searchTerm = signal<string>('');
  showAddForm = signal<boolean>(false);
  
  newRoom: Room = {
    room_number: '',
    room_type: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    this.hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
    this.loadHotel();
    this.loadRooms();
    this.loadRoomTypes();
  }

  loadHotel() {
    this.hotelService.getHotel(this.hotelId).subscribe(hotel => {
      this.hotel.set(hotel);
    });
  }

  loadRooms() {
    this.roomService.getRooms(this.hotelId).subscribe(rooms => {
      this.rooms.set(rooms);
      this.filterRooms();
    });
  }

  loadRoomTypes() {
    this.roomTypeService.getRoomTypes(this.hotelId).subscribe(roomTypes => {
      this.roomTypes.set(roomTypes);
    });
  }

  filterRooms() {
    let filtered = this.rooms();
    
    if (this.selectedRoomType()) {
      filtered = filtered.filter(room => room.room_type_name === this.selectedRoomType());
    }
    
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(room => 
        room.room_number.toLowerCase().includes(term) ||
        room.room_type_name?.toLowerCase().includes(term)
      );
    }
    
    this.filteredRooms.set(filtered);
  }

  onRoomTypeFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedRoomType.set(target.value);
    this.filterRooms();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filterRooms();
  }

  toggleAddForm() {
    this.showAddForm.set(!this.showAddForm());
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newRoom = {
      room_number: '',
      room_type: 0
    };
  }

  addRoom() {
    if (this.newRoom.room_number && this.newRoom.room_type) {
      this.roomService.createRoom(this.hotelId, this.newRoom).subscribe({
        next: () => {
          this.loadRooms();
          this.toggleAddForm();
        },
        error: (error) => {
          console.error('Error creating room:', error);
        }
      });
    }
  }

  deleteRoom(roomId: number) {
    // Remove confirmation dialog as it may be blocked by browser
    this.roomService.deleteRoom(this.hotelId, roomId).subscribe({
      next: () => {
        console.log('Room deleted successfully');
        this.loadRooms();
      },
      error: (error) => {
        console.error('Error deleting room:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/hotels', this.hotelId, 'room-types']);
  }
}
