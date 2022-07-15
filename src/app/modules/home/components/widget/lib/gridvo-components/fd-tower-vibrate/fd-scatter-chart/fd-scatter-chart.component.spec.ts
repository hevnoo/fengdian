import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdScatterChartComponent } from './fd-scatter-chart.component';

describe('FdScatterChartComponent', () => {
  let component: FdScatterChartComponent;
  let fixture: ComponentFixture<FdScatterChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdScatterChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdScatterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
