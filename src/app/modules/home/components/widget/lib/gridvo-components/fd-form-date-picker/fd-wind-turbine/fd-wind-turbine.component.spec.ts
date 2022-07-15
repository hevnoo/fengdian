import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FdWindTurbineComponent } from "./fd-wind-turbine.component";

describe("GfWindTurbineComponent", () => {
  let component: FdWindTurbineComponent;
  let fixture: ComponentFixture<FdWindTurbineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdWindTurbineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdWindTurbineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
