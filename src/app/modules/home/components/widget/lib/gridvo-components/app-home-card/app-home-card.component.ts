import { Component, Input, OnInit } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { WidgetConfig } from '@shared/models/widget.models';
/*
* @Author: zouzm
* @FileName: app首页数据展示微件
* @codeName: tb-app-home-card
* @Description: app首页数据展示
* @Path: \部件库\A
*/
@Component({
  selector: "tb-app-home-card",
  templateUrl: "./app-home-card.component.html",
  styleUrls: ["./app-home-card.component.scss"],
})
export class AppHomeCardComponent implements OnInit {

  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;

  settings;

  progressData = [];
  kpiData = [];

  constructor() { }

  ngOnInit(): void {
    this.ctx.$scope.appHomeCardWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
  }
  private initWidgetConfig() {
    this.settings = this.widgetConfig.settings.imgsArr;
  }

  public onDataUpdate() {
    this.handleTelemetryData();
  }
  public handleTelemetryData() {
    if(typeof(this.ctx.$scope.isOpen) === 'undefined') return;
    const isOpen = this.ctx.$scope.isOpen;
    let objOfKey = {
      "wf_total_active_power": "activePower", //总出力
      "day_total_power_gen": `dailyPower${new Date().getDate()}`, //今日发电量
      "wf_avg_wind": "avgWind", //当前风速
      "YearUsedRate": "annualOccupancy" //年利用率
    };
    const setJson = this.ctx.$scope.setJson;
    const handleData = this.ctx.data?.map(item => {
      let forge = Number(setJson[objOfKey[item.dataKey.name]]);
      if (isNaN(forge)) {
        forge = 0;
      }
      let i = {
        img: '',
        label: item.dataKey.label,
        value: isOpen? (Number(item.data[0][1]) + forge).toFixed(2) : item.data[0][1],
        unit: item.dataKey.units
      }
      this.settings.forEach(img => {
        if (item.dataKey.name == img.dataKey) {
          i.img = img.img;
        }
      });
      return i;
    });
    this.progressData = handleData.slice(0, 2);
    this.kpiData = handleData.slice(2);
    this.ctx.detectChanges()
  }
}
