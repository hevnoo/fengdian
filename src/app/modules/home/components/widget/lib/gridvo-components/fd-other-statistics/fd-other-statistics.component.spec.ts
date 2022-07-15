import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdOtherStatisticsComponent } from './fd-other-statistics.component';

describe('FdOtherStatisticsComponent', () => {
  let component: FdOtherStatisticsComponent;
  let fixture: ComponentFixture<FdOtherStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdOtherStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdOtherStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
