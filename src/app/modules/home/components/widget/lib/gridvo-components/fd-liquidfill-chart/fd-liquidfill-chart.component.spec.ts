import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdLiquidfillChartComponent } from './fd-liquidfill-chart.component';

describe('FdLiquidfillChartComponent', () => {
  let component: FdLiquidfillChartComponent;
  let fixture: ComponentFixture<FdLiquidfillChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdLiquidfillChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdLiquidfillChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
