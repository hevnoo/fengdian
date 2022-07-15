import { Component, OnInit, Input } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { DatasourceData, WidgetConfig } from "@shared/models/widget.models";
@Component({
  selector: "tb-fd-fengji-self",
  templateUrl: "./fd-fengji-self.component.html",
  styleUrls: ["./fd-fengji-self.component.scss"],
})
export class FdFengjiSelfComponent implements OnInit {
  public widgetConfig: WidgetConfig;

  public deviceHeader: DatasourceData[] = []; // 风机头部数据相关（显示在图上）

  public deviceDetail: DatasourceData[] = []; // 风机列表详情

  public deviceStatus: number = 0; //风机当前状态

  public deviceName: string = ""; // 风机名称

  public map = new Map()
    .set(1, "rgb(9, 95, 10, 0.5)") /* 正常运行 */
    .set(2, "rgb(23, 89, 95, 0.5)") /* 检修维护 */
    .set(3, "rgb(58, 67, 121, 0.5)") /* 待机 */
    .set(4, "rgb(236, 219, 163, 0.5)") /* 通讯中断 */
    .set(5, "rgb(65, 62, 62, 0.5)"); /* 机组停机 */

  public statusvalue = new Map()
    .set(1, "正常运行") /* 正常运行 */
    .set(2, "检修状态") /* 检修状态 */
    .set(3, "待机状态") /* 待机状态 */
    .set(4, "通讯中断") /* 通讯中断 */
    .set(5, "机组停机"); /* 机组停机 */

  @Input() ctx: WidgetContext;

  constructor() {}

  ngOnInit(): void {
    this.ctx.$scope.commonFengjiself = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initData();
  }

  initData() {
    let data = JSON.parse(JSON.stringify(this.ctx.data));
    // 获取值
    data.forEach((item: any) => {
      item.value = item.data?.[0]?.[1];
    });
    // 获取设备名
    if (data.length > 0) {
      this.deviceName = data[0].datasource.name;
    }

    // 切割数据,头部数据为特殊数据，有特殊浮动样式
    this.deviceHeader = data.splice(0, 7);
    this.deviceDetail = data.splice(0, 15);

    let deviceObj = {};
    data.forEach((item) => {
      deviceObj[item.dataKey.name] = item.data?.[0]?.[1];
    });
    this.chandleStatusData(deviceObj); // 确定风机状态
  }

  chandleStatusData(data) {
    if (data.tur_unit_run_on_grid == 1) {
      this.deviceStatus = 1;
    } else if (data.tur_unit_maintenance == 1) {
      this.deviceStatus = 2;
    } else if (data.tur_standby == 1) {
      this.deviceStatus = 3;
    } else if (data.tur_commu_interrupted == 1) {
      this.deviceStatus = 4;
    } else if (data.tur_unit_shutdown == 1) {
      this.deviceStatus = 5;
    }
  }

  public onDataUpdated() {
    this.initData();
    this.ctx.detectChanges();
  }
}
