import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdAlarmLevelComponent } from './fd-alarm-level.component';

describe('FdAlarmLevelComponent', () => {
  let component: FdAlarmLevelComponent;
  let fixture: ComponentFixture<FdAlarmLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdAlarmLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdAlarmLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
