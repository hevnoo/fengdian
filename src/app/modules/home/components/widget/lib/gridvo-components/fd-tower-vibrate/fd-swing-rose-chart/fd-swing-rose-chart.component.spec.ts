import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdSwingRoseChartComponent } from './fd-swing-rose-chart.component';

describe('FdSwingRoseChartComponent', () => {
  let component: FdSwingRoseChartComponent;
  let fixture: ComponentFixture<FdSwingRoseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdSwingRoseChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdSwingRoseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
