import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdBarChartV2Component } from './fd-bar-chart-v2.component';

describe('FdBarChartV2Component', () => {
  let component: FdBarChartV2Component;
  let fixture: ComponentFixture<FdBarChartV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdBarChartV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdBarChartV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
