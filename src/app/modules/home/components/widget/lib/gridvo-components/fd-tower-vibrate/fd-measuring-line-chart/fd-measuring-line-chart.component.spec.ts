import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdMeasuringLineChartComponent } from './fd-measuring-line-chart.component';

describe('FdMeasuringLineChartComponent', () => {
  let component: FdMeasuringLineChartComponent;
  let fixture: ComponentFixture<FdMeasuringLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdMeasuringLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdMeasuringLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
