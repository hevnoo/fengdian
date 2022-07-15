import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdMonitorTableComponent } from './fd-monitor-table.component';

describe('FdMonitorTableComponent', () => {
  let component: FdMonitorTableComponent;
  let fixture: ComponentFixture<FdMonitorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdMonitorTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdMonitorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
