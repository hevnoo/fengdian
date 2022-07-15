import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdSimpleBlockComponent } from './fd-simple-block.component';

describe('FdSimpleBlockComponent', () => {
  let component: FdSimpleBlockComponent;
  let fixture: ComponentFixture<FdSimpleBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdSimpleBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdSimpleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
