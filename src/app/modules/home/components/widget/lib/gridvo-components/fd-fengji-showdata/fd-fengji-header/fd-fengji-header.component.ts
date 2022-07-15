import { Component, OnInit, Input } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { WidgetConfig } from "@shared/models/widget.models";

@Component({
  selector: "tb-fd-fengji-header",
  templateUrl: "./fd-fengji-header.component.html",
  styleUrls: ["./fd-fengji-header.component.scss"],
})
export class FdFengjiHeaderComponent implements OnInit {
  public widgetConfig: WidgetConfig;
  public fengJiValue: any = {};

  @Input() ctx: WidgetContext;

  constructor() {}

  ngOnInit(): void {
    this.ctx.$scope.commonFengjiHead = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initData();
  }

  initData() {
    // 初始化数据
    this.fengJiValue = {};
    this.ctx.data.map((item) => {
      let temp = item.data?.[0]?.[1] ?? -1;
      // 日发电量以万kwh为单位
      if (item.dataKey.name === "day_total_power_gen") {
        temp = temp / 10000;
      }
      this.fengJiValue[item.dataKey.name] = temp;
    });
  }

  public onDataUpdated() {
    this.initData();
    this.ctx.detectChanges();
  }
}
