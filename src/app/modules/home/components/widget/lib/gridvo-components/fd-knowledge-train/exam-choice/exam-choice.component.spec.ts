import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamChoiceComponent } from './exam-choice.component';

describe('ExamChoiceComponent', () => {
  let component: ExamChoiceComponent;
  let fixture: ComponentFixture<ExamChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
