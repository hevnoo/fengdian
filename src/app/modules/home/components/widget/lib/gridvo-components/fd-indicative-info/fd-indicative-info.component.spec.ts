import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FdIndicativeInfoComponent } from "./fd-indicative-info.component";

describe("GfIndicativeInfoComponent", () => {
  let component: FdIndicativeInfoComponent;
  let fixture: ComponentFixture<FdIndicativeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdIndicativeInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdIndicativeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
