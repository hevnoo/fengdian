import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { isDefined } from "@core/utils";
import { WidgetConfig } from "@shared/models/widget.models";
@Component({
  selector: "tb-fd-other-statistics",
  templateUrl: "./fd-other-statistics.component.html",
  styleUrls: ["./fd-other-statistics.component.scss"],
})
export class FdOtherStatisticsComponent implements OnInit {
  @Input() ctx: WidgetContext;
  public widgetConfig: WidgetConfig;
  // 可配置样式
  public bgColor: string;
  public valueTextSize: string;
  public isNeedBg: boolean = true;
  public valueTextColor: string;
  public titleAndUnitColor: string;

  public dataArr: any[] = [];
  constructor() {}

  ngOnInit(): void {
    console.log("this.ctx :>> ", this.ctx);
    this.ctx.$scope.otherStatisticsWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initData();
    this.initConfig();
  }
  initConfig() {
    // 配置项
    this.isNeedBg = isDefined(this.widgetConfig.settings.isNeedBg)
      ? this.widgetConfig.settings.isNeedBg
      : true;
    this.bgColor = isDefined(this.widgetConfig.settings.bgColor)
      ? this.widgetConfig.settings.bgColor
      : "rgba(26, 209, 241, 0.178)";
    this.valueTextColor = isDefined(this.widgetConfig.settings.valueTextColor)
      ? this.widgetConfig.settings.valueTextColor
      : "rgba(0, 0, 0, 0.85)";
    this.titleAndUnitColor = isDefined(
      this.widgetConfig.settings.titleAndUnitColor
    )
      ? this.widgetConfig.settings.titleAndUnitColor
      : "rgba(0, 0, 0, 0.65)";
    this.valueTextSize = isDefined(this.widgetConfig.settings.valueTextSize)
      ? this.widgetConfig.settings.valueTextSize
      : "1.1em";
  }

  initData() {
    if (this.ctx.$scope.isOpen === "true") {
      let objOfKey = {
        wf_total_active_power: "activePower", //总出力
        day_total_power_gen: `dailyPower${new Date().getDate()}`, //今日发电量
        wf_avg_wind: "avgWind", //当前风速
        YearUsedRate: "annualOccupancy", //年利用率
      };
      this.dataArr = [];
      const setJson = this.ctx.$scope.setJson;
      this.ctx?.data.forEach((item) => {
        let forge = Number(setJson[objOfKey[item.dataKey.name]]);
        if (isNaN(forge)) {
          forge = 0;
        }
        const val = Number(item.data?.[0]?.[1]) + forge;
        let currentObj = {
          keyName: item.dataKey.label,
          valueNum: val,
          units: item.dataKey.units,
        };
        this.dataArr.push(currentObj);
      });
      console.log("大屏数据", this.dataArr);
      console.log("大屏数据");
    } else {
      this.dataArr = [];
      this.ctx?.data.forEach((item) => {
        let currentObj = {
          keyName: item.dataKey.label,
          valueNum: item.data?.[0]?.[1],
          units: item.dataKey.units,
        };
        this.dataArr.push(currentObj);
      });
    }
  }

  public onDataUpdated() {
    this.initData();
    this.ctx.detectChanges();
  }
}
