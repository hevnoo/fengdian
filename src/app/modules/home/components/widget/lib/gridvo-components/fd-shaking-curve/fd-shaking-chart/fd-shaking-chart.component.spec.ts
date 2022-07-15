import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdShakingChartComponent } from './fd-shaking-chart.component';

describe('FdShakingChartComponent', () => {
  let component: FdShakingChartComponent;
  let fixture: ComponentFixture<FdShakingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdShakingChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdShakingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
