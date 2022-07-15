import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyComponent } from './dialog-modify.component';

describe('DialogModifyComponent', () => {
  let component: DialogModifyComponent;
  let fixture: ComponentFixture<DialogModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
