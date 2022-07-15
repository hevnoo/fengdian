import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTrendCompareComponent } from './fd-trend-compare.component';

describe('FdTrendCompareComponent', () => {
  let component: FdTrendCompareComponent;
  let fixture: ComponentFixture<FdTrendCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdTrendCompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTrendCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
