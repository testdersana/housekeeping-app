import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypeSetup } from './room-type-setup';

describe('RoomTypeSetup', () => {
  let component: RoomTypeSetup;
  let fixture: ComponentFixture<RoomTypeSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTypeSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomTypeSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
