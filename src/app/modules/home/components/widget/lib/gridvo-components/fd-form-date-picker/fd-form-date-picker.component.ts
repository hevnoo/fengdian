import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { getYear, getMonth, getDate, differenceInCalendarDays } from "date-fns";

import type { IDateType } from "./type";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { GfDayUtils } from "@gwhome/common/utils";
import chche from "@gwhome/common/utils";
const { LocalChche } = chche;

@Component({
  selector: "tb-fd-form-date-picker",
  templateUrl: "./fd-form-date-picker.component.html",
  styleUrls: ["./fd-form-date-picker.component.scss"],
})
export class FdFormDatePickerComponent
  implements OnInit, AfterViewInit, OnDestroy {
  /**时间选择器类型 */
  mode: IDateType = "date";
  isNeedChangeState: boolean = false;

  @Input()
  ctx!: WidgetContext;

  @Input()
  windTurbineSelect = false;

  @Output()
  dateParamsEmiter = new EventEmitter();
  // datePicker选择器双向绑定的值
  unknownDate: Date | null = null;
  constructor() {}

  ngOnInit(): void {
    LocalChche.setCache("chooseTimeType", "month");
    this.isNeedChangeState = this.ctx.settings.isNeedChangeState;
  }

  // @ViewChild("username") input: ElementRef | any;
  ngAfterViewInit(): void {
    this.changeDate("month");
  }

  ngOnDestroy(): void {
    LocalChche.deleteCache("chooseTimeType");
  }

  /**事件选择器，选中时间回调函数 */
  onCheckDate(date: Date) {
    LocalChche.setCache("chooseTimeType", this.mode);
    if (this.isNeedChangeState) {
      this.ctx.stateController.updateState(
        this.mode,
        this.ctx.stateController.getStateParams(),
        false
      );
    }
    this.unknownDate = date;
    /**保存时间选择器类型 */
    let resultDate = this.mode;
    this.dateType = "today";
    if (this.mode === "date") resultDate = "today";
    const timeParams = this.swithDateType(resultDate, date, getYear(date));
    this.dateParamsEmiter.emit({ timeParams });
    const [start, end] = timeParams;
    this.ctx.timewindowFunctions.onUpdateTimewindow(start, end);
  }

  /**右侧三个按钮类型，昨天，本月，本年。 */
  dateType: IDateType = "month";

  /**
   * span点击按钮响应
   * @param type IDateType类型
   */
  changeDate(type: IDateType) {
    this.unknownDate = null;
    let timeParams: number[] = [];
    this.ctx.$scope.currentType = type;
    this.dateType = type;
    LocalChche.setCache("chooseTimeType", type);
    if (this.isNeedChangeState) {
      this.ctx.stateController.updateState(
        type,
        this.ctx.stateController.getStateParams(),
        false
      );
    }
    timeParams = this.swithDateType(type);
    this.dateParamsEmiter.emit({ timeParams });
    const [start, end] = timeParams;
    this.ctx.timewindowFunctions.onUpdateTimewindow(start, end);
  }

  displayInfo: number | string = "";
  /**
   * @param type 类型
   * @param date 日期可选
   * @param year 年份可选
   * @returns 日期的开始时间和结束时间，数组。
   */
  swithDateType(type: IDateType, date?: Date, year?: number): number[] {
    switch (type) {
      case "today":
        this.displayInfo = getYear(GfDayUtils.getBeginTodayAndEnd(0, date));
        return [
          GfDayUtils.getBeginTodayAndEnd(0, date),
          GfDayUtils.getBeginTodayAndEnd(1, date),
        ];
      // 昨天
      case "date":
        this.displayInfo = getDate(GfDayUtils.getBeginYesterdayAndEnd(0));
        return [
          GfDayUtils.getBeginYesterdayAndEnd(0),
          GfDayUtils.getBeginYesterdayAndEnd(1),
        ];
      case "month":
        this.displayInfo = getMonth(GfDayUtils.getBeginMonth(date, year)) + 1;
        return [
          GfDayUtils.getBeginMonth(date, year),
          GfDayUtils.getEndMonth(date, year),
        ];
      case "year":
        this.displayInfo = getYear(GfDayUtils.getBeginYear(year));
        return [GfDayUtils.getBeginYear(year), GfDayUtils.getEndYear(year)];
      default:
        const exhaustiveCheck: never = type;
        break;
    }
  }

  /**
   * @param mode 选择的日期格式
   * @returns 预显示信息
   */
  showPlaceHolder(mode: IDateType) {
    switch (mode) {
      case "date":
        return "选择日期";
      case "month":
        return "选择月";
      default:
        return "选择年";
    }
  }

  showSpanHolder(mode: IDateType) {
    switch (mode) {
      case "date":
        return "选择日期";
      case "month":
        return "选择月";
      case "year":
        return "";
      case "today":
        return "";
      default:
        const exhaustiveCheck: never = mode;
    }
  }

  // /**
  //  * @param _ 索引index
  //  * @param windTurbine 遍历对象
  //  * @returns 返回判断唯一标识符
  //  */
  // trackByLabel(_: number, windTurbine: unknown) {
  //   return (windTurbine as any).name;
  // }

  disabledDate = (current: Date): boolean =>
    // 0今天之后不可选取，20表示20天之后不可选取
    differenceInCalendarDays(current, GfDayUtils.currentDate) >= 0;
}
