import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdSwingTrackChartComponent } from './fd-swing-track-chart.component';

describe('FdSwingTrackChartComponent', () => {
  let component: FdSwingTrackChartComponent;
  let fixture: ComponentFixture<FdSwingTrackChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdSwingTrackChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdSwingTrackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
