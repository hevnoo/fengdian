import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTowerVibrateHeaderComponent } from './fd-tower-vibrate-header.component';

describe('FdTowerVibrateHeaderComponent', () => {
  let component: FdTowerVibrateHeaderComponent;
  let fixture: ComponentFixture<FdTowerVibrateHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdTowerVibrateHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTowerVibrateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
