import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdMeasuringLineChartGroupComponent } from './fd-measuring-line-chart-group.component';

describe('FdMeasuringLineChartGroupComponent', () => {
  let component: FdMeasuringLineChartGroupComponent;
  let fixture: ComponentFixture<FdMeasuringLineChartGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdMeasuringLineChartGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdMeasuringLineChartGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
