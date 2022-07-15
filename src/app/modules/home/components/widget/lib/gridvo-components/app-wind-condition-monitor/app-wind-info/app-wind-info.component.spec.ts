import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppWindInfoComponent } from './app-wind-info.component';

describe('AppWindInfoComponent', () => {
  let component: AppWindInfoComponent;
  let fixture: ComponentFixture<AppWindInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppWindInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppWindInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
