import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdDeviceDialogComponent } from './fd-device-dialog.component';

describe('FdDeviceDialogComponent', () => {
  let component: FdDeviceDialogComponent;
  let fixture: ComponentFixture<FdDeviceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdDeviceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
