import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, ComponentFactoryResolver } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import {
  WidgetConfig
} from '@shared/models/widget.models';
import { map } from 'lodash';
@Component({
  selector: 'tb-fd-fengji-matrix',
  templateUrl: './fd-fengji-matrix.component.html',
  styleUrls: ['./fd-fengji-matrix.component.scss']
})
export class FdFengjiMatrixComponent implements OnInit {
  public widgetConfig: WidgetConfig;
  public windmillStatusColorMap: Map<number, string>;
  public dataList: any[];
  cloudMountain: any[] = [];
  windMountain: any[] = [];
  public divStyle
  public map = new Map()
    .set(1, 'rgb(9, 95, 10, 0.5)') /* 正常运行 */
    .set(2, 'rgb(23, 89, 95, 0.5)') /* 检修维护 */
    .set(3, 'rgb(58, 67, 121, 0.5)') /* 待机 */
    .set(4, 'rgb(236, 219, 163, 0.5)') /* 通讯中断 */
    .set(5, 'rgb(65, 62, 62, 0.5)') /* 机组停机 */
  @Input() ctx: WidgetContext;


  ngOnInit(): void {
    this.ctx.$scope.commonFengjimatrix = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initData();

  }


  // 此方法跳转到其他的仪表板状态
  changeState = (item) => {
    let params = {
      entityId: item
    }
    // 参数1，要跳转的仪表板状态id;  参数2，需要跳转到哪个实体
    this.ctx.stateController.updateState("detail", params, false)
  }



  initData() {
    let deviceObj = {}
    this.ctx?.data.forEach(item => {
      let keys = parseInt((item.datasource.name).slice(2))
      let hasKeys = deviceObj[keys] ?? false
      if (hasKeys) {
        deviceObj[keys][item.dataKey.name] = item.data?.[0]?.[1]
      }
      else {
        deviceObj[keys] = {};
        deviceObj[keys]["name"] = keys;
        deviceObj[keys]["entityId"] = item.datasource.entity.id;
        deviceObj[keys][item.dataKey.name] = Math.floor(item.data?.[0]?.[1]) ?? -1;
      }
    })
    this.dataList = Object.values(deviceObj)
    this.chandleStatusData(this.dataList)
    this.cloudMountain = [];
    this.windMountain = [];
    this.dataList.forEach(item => {
      if(item.name < 21) {
        this.cloudMountain.push(item)
      } else {
        this.windMountain.push(item)
      }
    })
  }


  chandleStatusData(data) {
    data?.forEach(item => {
      if (item.tur_unit_run_on_grid == 1) {
        item.status = 1;
      } else if (item.tur_unit_maintenance == 1) {
        item.status = 2;
      } else if (item.tur_standby == 1) {
        item.status = 3;
      } else if (item.tur_commu_interrupted == 1) {
        item.status = 4;
      } else if (item.tur_unit_shutdown == 1) {
        item.status = 5;
      }
    })

  }

  public onDataUpdated() {
    this.initData()
    this.ctx.detectChanges();
  }

  // 为能量条做数据准备
  changeProcess(item) {
    let newdata = ((item / 40000) * 100).toFixed(1)
    return newdata;
  }

}


