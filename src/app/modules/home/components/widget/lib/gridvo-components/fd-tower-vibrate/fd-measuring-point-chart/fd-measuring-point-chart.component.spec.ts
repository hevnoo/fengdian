import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdMeasuringPointChartComponent } from './fd-measuring-point-chart.component';

describe('FdMeasuringPointChartComponent', () => {
  let component: FdMeasuringPointChartComponent;
  let fixture: ComponentFixture<FdMeasuringPointChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdMeasuringPointChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdMeasuringPointChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
