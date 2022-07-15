import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdShakingCurveComponent } from './fd-shaking-curve.component';

describe('FdShakingCurveComponent', () => {
  let component: FdShakingCurveComponent;
  let fixture: ComponentFixture<FdShakingCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdShakingCurveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdShakingCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
