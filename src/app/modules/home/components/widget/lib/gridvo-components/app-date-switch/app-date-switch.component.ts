import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { GridvoUtilsService } from "@app/core/services/gridvo-utils.service";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import moment from "moment";
export interface TimeRange {
  startTime: number;
  endTime: number;
}
@Component({
  selector: "tb-app-date-switch",
  templateUrl: "./app-date-switch.component.html",
  styleUrls: ["./app-date-switch.component.scss"],
})
export class AppDateSwitchComponent implements OnInit {
  @Input() ctx: WidgetContext;
  currentTimeType: string = "date";
  currentTime: any;
  
  timeTypeArr: object[] = [
    { name: "昨日", type: "date" },
    { name: "本月", type: "month" },
    { name: "本年", type: "year" },
  ];
  timeRange: TimeRange;
  constructor(private utils: GridvoUtilsService) {}

  ngOnInit(): void {
    this.getStartTimeAndAndTime(this.currentTimeType) 
    console.log(this.ctx.timeWindow, "指标分析时间", "qqq");
    
    window.localStorage.setItem("app_choose_time_type", this.currentTimeType);
  } 
  changeTimeType(item) {
    this.currentTime = ""
    this.currentTimeType = item.type;
    this.getStartTimeAndAndTime(item.type);
    window.localStorage.setItem("app_choose_time_type", item.type);
  }
  ngOnDestroy(): void {
    window.localStorage.removeItem("app_choose_time_type"); 
  }
  
  onTimeChange(time: Date) {
    this.currentTimeType = ""
    window.localStorage.setItem("app_choose_time_type", "date");
    let { startTime, endTime } = this.utils.getTodayStartEnd(time);
    console.log("时间", time.getTime(), startTime, endTime);
    this.ctx.timewindowFunctions.onUpdateTimewindow(startTime, endTime);
  }

  getStartTimeAndAndTime(type) {
    switch (type) {
      case "month":
        this.timeRange = {
          startTime: moment().startOf("month").valueOf(),
          endTime: moment().endOf("month").valueOf(),
        };
        break;

      case "year":
        this.timeRange = {
          startTime: moment().startOf("year").valueOf(),
          endTime: moment().endOf("year").valueOf(),
        };
        break;

      default:
        let { startTime, endTime } = this.utils.getTodayStartEnd(
          moment().subtract(1, "days")
        );
        this.timeRange = { startTime, endTime };
    }
    console.log(type, this.timeRange);
    this.ctx.timewindowFunctions.onUpdateTimewindow(
      this.timeRange.startTime,
      this.timeRange.endTime
    );
  }
}
