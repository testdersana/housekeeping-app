import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-hotel-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './hotel-layout.html',
  styleUrl: './hotel-layout.css'
})
export class HotelLayoutComponent implements OnInit {
  hotelId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get the hotel ID from the route
    this.route.params.subscribe(params => {
      if (params['id'] || params['hotelId']) {
        this.hotelId = +(params['id'] || params['hotelId']);
      }
    });
  }
}