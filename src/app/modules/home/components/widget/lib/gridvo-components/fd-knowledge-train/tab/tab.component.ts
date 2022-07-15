import { AfterViewInit, Component, OnInit } from "@angular/core";
import { KonwgledService } from "@app/modules/home/components/widget/lib/gridvo-components/fd-knowledge-train/konwgled.service";

@Component({
  selector: "fd-knowledge-tb-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"],
})
export class TabComponent implements OnInit, AfterViewInit {
  constructor(private kscs: KonwgledService) {}
  // imageTab: IAddImageTab = this.kscs.getImageTab(ImageInfoComponent);
  // tabInfo: ITabInfo[] = this.kscs.getTabInfo(ImageInfoComponent);
  value: string = "";
  barStyle = {
    backgroundColor: "transparent",
    background: "#f4f4f4",
  };

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
}
