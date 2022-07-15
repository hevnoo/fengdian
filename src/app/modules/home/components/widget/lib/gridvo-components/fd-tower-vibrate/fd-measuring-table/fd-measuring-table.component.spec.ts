import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdMeasuringTableComponent } from './fd-measuring-table.component';

describe('FdMeasuringTableComponent', () => {
  let component: FdMeasuringTableComponent;
  let fixture: ComponentFixture<FdMeasuringTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdMeasuringTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdMeasuringTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
