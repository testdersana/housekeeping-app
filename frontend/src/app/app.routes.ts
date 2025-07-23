import { Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list';
import { HotelFormComponent } from './components/hotel-form/hotel-form';
import { RoomTypeSetupComponent } from './components/room-type-setup/room-type-setup';
import { RoomManagement } from './components/room-management/room-management';

export const routes: Routes = [
  { path: '', redirectTo: '/hotels', pathMatch: 'full' },
  { path: 'hotels', component: HotelListComponent },
  { path: 'hotels/new', component: HotelFormComponent },
  { path: 'hotels/:id/edit', component: HotelFormComponent },
  { path: 'hotels/:id/room-types', component: RoomTypeSetupComponent },
  { path: 'hotels/:hotelId/rooms', component: RoomManagement },
];
