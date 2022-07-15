import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FdAnnouncementManageComponent } from "./fd-announcement-manage.component";

describe("GfAnnouncementManageComponent", () => {
  let component: FdAnnouncementManageComponent;
  let fixture: ComponentFixture<FdAnnouncementManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FdAnnouncementManageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdAnnouncementManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
