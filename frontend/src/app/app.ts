import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HotelService } from './services/hotel';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly pageTitle = signal('Hotels');
  protected readonly showAdminText = signal(true);

  constructor(
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageTitle(event.url);
    });
  }

  private updatePageTitle(url: string) {
    if (url.includes('/room-types') || url.includes('/rooms')) {
      // Extract hotel ID from URL like /hotels/1/room-types or /hotels/1/rooms
      const hotelIdMatch = url.match(/\/hotels\/(\d+)\/(room-types|rooms)/);
      if (hotelIdMatch) {
        const hotelId = parseInt(hotelIdMatch[1]);
        this.hotelService.getHotel(hotelId).subscribe(hotel => {
          this.pageTitle.set(hotel.name);
          this.showAdminText.set(false);
        });
      }
    } else {
      this.pageTitle.set('Hotels');
      this.showAdminText.set(true);
    }
  }
}
