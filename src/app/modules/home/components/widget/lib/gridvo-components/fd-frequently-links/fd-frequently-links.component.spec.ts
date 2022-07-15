import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdFrequentlyLinksComponent } from './fd-frequently-links.component';

describe('FdFrequentlyLinksComponent', () => {
  let component: FdFrequentlyLinksComponent;
  let fixture: ComponentFixture<FdFrequentlyLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdFrequentlyLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdFrequentlyLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
