import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdAnFormAddComponent } from './fd-an-form-add.component';

describe('FdAnFormAddComponent', () => {
  let component: FdAnFormAddComponent;
  let fixture: ComponentFixture<FdAnFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdAnFormAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdAnFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
