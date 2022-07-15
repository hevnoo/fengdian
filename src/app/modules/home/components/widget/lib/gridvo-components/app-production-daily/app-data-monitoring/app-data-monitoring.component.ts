import { Component, Input, OnInit } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";

@Component({
  selector: 'tb-app-data-monitoring',
  templateUrl: './app-data-monitoring.component.html',
  styleUrls: ['./app-data-monitoring.component.scss']
})
export class FdAppDataMonitoringComponent implements OnInit {

  @Input() ctx: WidgetContext;
  @Input() apiData: any;  // 通过接口调用的数据

  public itemArr: any[]   // 通过TB配置的展示项

  constructor() {

  }

  ngOnInit(): void {
    this.ctx.$scope.dataMonitor = this
    this.initSetting()
    this.initData()
  }

  initSetting() {
    let settings = this.ctx.widgetConfig.settings
    this.itemArr = settings?.dataItem || ['']
  }

  // 数据初始化
  initData() {
    console.log(this.apiData, "月完成？");
    
    this.itemArr.forEach((item, i) => {
      let val
      if (this.ctx.data[i]?.data?.length !== 0) {
        val = Number(this.ctx.data[i]?.data?.[this.ctx.data[i]?.data?.length - 1]?.[1] || 0)
      } else {
        if (!!this.apiData) {
          for (let key in this.apiData) {

            if (this.ctx.data[i]?.dataKey?.name == key) {

              this.ctx.data[i]?.data.push([this.apiData[key][0]?.ts, this.apiData[key][0]?.value])
              val = Number(this.ctx.data[i]?.data?.[this.ctx.data[i]?.data?.length - 1]?.[1] || 0)
            }
          }
        }

      }
      if (item.unit == '万kWh') {
        item.dataValue = Number((val || 0) / 10000).toFixed(2) || 0
        return
      }
      item.dataValue = val || 0
    })

  }

  public onDataUpdate() {
    console.log(this.apiData, "年完成？");
    this.initData()
    this.ctx.detectChanges()
  }

}