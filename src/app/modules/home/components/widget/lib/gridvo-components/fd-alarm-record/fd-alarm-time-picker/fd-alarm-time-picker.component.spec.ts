import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdAlarmTimePickerComponent } from './fd-alarm-time-picker.component';

describe('FdAlarmTimePickerComponent', () => {
  let component: FdAlarmTimePickerComponent;
  let fixture: ComponentFixture<FdAlarmTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdAlarmTimePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdAlarmTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
