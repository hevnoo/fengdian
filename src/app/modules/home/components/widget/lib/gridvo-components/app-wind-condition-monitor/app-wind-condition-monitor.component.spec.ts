import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWindConditionMonitorComponent } from './app-wind-condition-monitor.component';

describe('AppWindConditionMonitorComponent', () => {
  let component: AppWindConditionMonitorComponent;
  let fixture: ComponentFixture<AppWindConditionMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppWindConditionMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWindConditionMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
