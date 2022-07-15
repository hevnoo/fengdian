import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTowerVibrateComponent } from './fd-tower-vibrate.component';

describe('FdTowerVibrateComponent', () => {
  let component: FdTowerVibrateComponent;
  let fixture: ComponentFixture<FdTowerVibrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdTowerVibrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTowerVibrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
