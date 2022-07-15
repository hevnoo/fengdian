import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdKnowledgeTrainComponent } from './fd-knowledge-train.component';

describe('GfKnowledgeTrainComponent', () => {
  let component: FdKnowledgeTrainComponent;
  let fixture: ComponentFixture<FdKnowledgeTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdKnowledgeTrainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdKnowledgeTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
