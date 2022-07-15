import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTowerSearchComponent } from './fd-tower-search.component';

describe('FdTowerSearchComponent', () => {
  let component: FdTowerSearchComponent;
  let fixture: ComponentFixture<FdTowerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdTowerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTowerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
