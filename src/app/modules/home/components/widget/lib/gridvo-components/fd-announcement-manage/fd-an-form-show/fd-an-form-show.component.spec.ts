import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdAnFormShowComponent } from './fd-an-form-show.component';

describe('FdAnFormShowComponent', () => {
  let component: FdAnFormShowComponent;
  let fixture: ComponentFixture<FdAnFormShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdAnFormShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdAnFormShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
