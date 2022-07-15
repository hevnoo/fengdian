import { Component, Input, OnInit } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { Datasource } from '@shared/models/widget.models'
import moment from 'moment';

interface TableColumns {
  prop: string,
  label: string,
  origin?: Datasource
  units?: string,
  formatter?: (data: any) => any
}

@Component({
  selector: 'tb-app-wind-info',
  templateUrl: './app-wind-info.component.html',
  styleUrls: ['./app-wind-info.component.scss']
})
export class AppWindInfoComponent implements OnInit {
  @Input() ctx: WidgetContext

  interval = 45
  length = 360 / this.interval
  windDirectionAngle: number[] = ((): number[] => {
    const arr = [];
    for (let i = 0; i < this.length; i++) {
      arr.push(i * this.interval)
    }
    return arr
  })()

  tableColumns: Array<TableColumns> = []
  tableData: Array<any> = []

  constructor() { }

  ngOnInit(): void {
    this.ctx.$scope.AppWindInfo = this
    this.initTabelColums()
  }

  initTabelColums() {
    this.tableColumns = this.ctx.datasources[0].dataKeys.map(i => {
      return {
        prop: i.name,
        label: i.label,
        units: i.units || '',
        origin: i
      }
    })
    this.tableColumns.push({
      prop: "time",
      label: "接收时间",
      formatter: (data: any): any => {
        return moment(Number(data.time)).format("HH时mm分")
      }
    })
    this.tableColumns.unshift({
      prop: "name",
      label: "风机"
    })
  }

  windDirectionTransformRotate(data) {
    const { wind_direction } = data
    let angle = 0
    if (wind_direction > 0) {
      angle = 360 - wind_direction
    } else {
      angle = Math.abs(wind_direction)
    }
    let index = Math.round(angle / this.interval)
    if(index === this.windDirectionAngle.length) {
      index = 0
    }
    return `rotate(${this.windDirectionAngle[index] + 90}deg)`
  }

  dataTrans2Obj(): any {
    let obj = {}
    this.ctx.data.forEach(i => {
      if (!i.data?.[0]?.[0]) { return }

      if (!obj[i.datasource.name]) {
        obj[i.datasource.name] = {}
      }
      if (!obj[i.datasource.name][i.data[0][0]]) {
        obj[i.datasource.name][i.data[0][0]] = {}
      }
      obj[i.datasource.name][i.data[0][0]][i.dataKey.name] = i.data[0][1]
      obj[i.datasource.name][i.data[0][0]].origin = i
    })
    return obj
  }

  public onDataUpdated() {
    const obj = this.dataTrans2Obj()
    const entriesData = Object.entries(obj)

    const dataList = new Array(entriesData.length)
    entriesData.forEach(([key, value]) => {
      const index = Number(key.slice(2))
      Object.entries(value).forEach(([timestamp, vValue]) => {
        const name = vValue.origin.datasource.entityLabel.split('/').pop()
        dataList[index - 1] = { ...vValue, time: timestamp, name: name }
      })
    })
    this.tableData = dataList
    this.ctx.detectChanges()
  }
}
