import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCaiTestComponent } from './fd-cai-test.component';

describe('FdCaiTestComponent', () => {
  let component: FdCaiTestComponent;
  let fixture: ComponentFixture<FdCaiTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdCaiTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdCaiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
