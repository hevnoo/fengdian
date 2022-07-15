import { Component, OnInit } from "@angular/core";
import { KonwgledService } from "@app/modules/home/components/widget/lib/gridvo-components/fd-knowledge-train/konwgled.service";
import { EChartsOption } from "echarts";
import type { IProjectConfig } from "../type/type";

@Component({
  selector: "tb-main-info",
  templateUrl: "./main-info.component.html",
  styleUrls: ["./main-info.component.scss"],
})
export class MainInfoComponent implements OnInit {
  constructor(private konwgledService: KonwgledService) {}
  option: EChartsOption = this.konwgledService.getProjectEChartsOption();
  projects: IProjectConfig[] = this.konwgledService.getProjectConfigInfo();
  ngOnInit(): void {}
}
