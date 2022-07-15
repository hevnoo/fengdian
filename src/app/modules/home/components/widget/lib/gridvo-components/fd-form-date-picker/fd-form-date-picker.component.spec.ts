import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FdFormDatePickerComponent } from "./fd-form-date-picker.component";

describe("GfFormDatePickerComponent", () => {
  let component: FdFormDatePickerComponent;
  let fixture: ComponentFixture<FdFormDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdFormDatePickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdFormDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
