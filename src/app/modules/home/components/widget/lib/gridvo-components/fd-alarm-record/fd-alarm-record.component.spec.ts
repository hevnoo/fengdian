import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdAlarmRecordComponent } from './fd-alarm-record.component';

describe('FdAlarmRecordComponent', () => {
  let component: FdAlarmRecordComponent;
  let fixture: ComponentFixture<FdAlarmRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdAlarmRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdAlarmRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
