import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { deepClone } from '@app/core/utils';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import { FdScatterChartComponent } from '../fd-scatter-chart/fd-scatter-chart.component';
import { AttributeService } from "@core/http/attribute.service";
import { AttributeScope } from "@shared/models/telemetry/telemetry.models";
import { Datasource } from '@app/shared/models/widget.models';

@Component({
  selector: 'tb-fd-trend-compare',
  templateUrl: './fd-trend-compare.component.html',
  styleUrls: ['./fd-trend-compare.component.scss']
})
export class FdTrendCompareComponent implements OnInit {
  @Input() ctx: WidgetContext

  attrNameMap: Map<string, any> = new Map()
    // .set("tower_sensor1", { label: "测点1", sort: 1 })
    // .set("tower_sensor2", { label: "测点2", sort: 2 })
    // .set("tower_sensor3", { label: "测点3", sort: 3 })
  measuringValue: string = ""
  dataObject = {}
  @ViewChild('chart1') chart1: FdScatterChartComponent
  chart1Option: EChartsOption = {
    title: {
      text: "1-3月",
      left: 'center',
      top: '10%'
    },
    xAxis: {
      max: 3,
      min: -3
    },
    yAxis: {
      max: 3,
      min: -3
    },
    series: [
      {
        symbolSize: 5,
        data: [],
        type: 'scatter'
      }
    ]
  }
  @ViewChild('chart2') chart2: FdScatterChartComponent
  chart2Option: EChartsOption = {
    title: {
      text: "4-6月",
      left: 'center',
      top: '10%'
    },
    xAxis: {
      max: 3,
      min: -3
    },
    yAxis: {
      max: 3,
      min: -3
    },
    series: [
      {
        symbolSize: 5,
        data: [],
        type: 'scatter'
      }
    ]
  }
  @ViewChild('chart3') chart3: FdScatterChartComponent
  chart3Option: EChartsOption = {
    title: {
      text: "7-9月",
      left: 'center',
      top: '10%'
    },
    xAxis: {
      max: 3,
      min: -3
    },
    yAxis: {
      max: 3,
      min: -3
    },
    series: [
      {
        symbolSize: 5,
        data: [],
        type: 'scatter'
      }
    ]
  }
  @ViewChild('chart4') chart4: FdScatterChartComponent
  chart4Option: EChartsOption = {
    title: {
      text: "10-12月",
      left: 'center',
      top: '10%'
    },
    xAxis: {
      max: 3,
      min: -3
    },
    yAxis: {
      max: 3,
      min: -3
    },
    series: [
      {
        symbolSize: 5,
        data: [],
        type: 'scatter'
      }
    ]
  }

  constructor(private attributeService: AttributeService) { }

  ngOnInit(): void {
    this.ctx.$scope.FdTrendCompare = this
    let arr: Datasource[] = []
    Promise.all(this.ctx.datasources.map(i => {
      arr.push(i)
      return this.attributeService.getEntityAttributes(i.entity.id, AttributeScope.SERVER_SCOPE).toPromise()
    })).then(values => {
      values.forEach((i, index) => {
        let label = ""
        i.forEach(j => {
          if (j.key === "sensorPosition") {
            label = `测点${j.value}`
          }
        })
        if (label) {
          this.attrNameMap.set(arr[index].name, { label: label, prop: "cd" })
        }
      })
      this.onDataUpdated()
    })
  }

  setDataObject() {
    let obj = {}
    this.ctx.data.forEach(j => {
      const attrKey = this.attrNameMap.get(j.datasource.name)?.label
      if(attrKey) {
        if (!obj[attrKey]) {
          obj[attrKey] = {}
        }
        j.data.forEach(i => {
          if (!obj[attrKey][i[0]]) {
            obj[attrKey][i[0]] = {}
          }
          obj[attrKey][i[0]][j.dataKey.name] = i[1]
        })
      }
    })
    if(this.measuringValue) {
      this.dataObject = deepClone(obj[this.measuringValue])
    }
  }

  handleSearch(values) {
    this.measuringValue = values.measuringValue
    this.onDataUpdated()
  }

  setChartOptions() {
    this.clearChartData()
    Object.entries(this.dataObject).forEach(([time, value]) => {
      const m = new Date(Number(time)).getMonth()
      switch (m) {
        case 0:
        case 1:
        case 2: {
          const { x, y } = value as any
          this.chart1Option.series[0].data.push([x, y])
          break;
        }
        case 3:
        case 4:
        case 5: {
          const { x, y } = value as any
          this.chart2Option.series[0].data.push([x, y])
          break;
        }
        case 6:
        case 7:
        case 8:
          {
            const { x, y } = value as any
            this.chart3Option.series[0].data.push([x, y])
            break;
          }
        case 9:
        case 10:
        case 11:
          {
            const { x, y } = value as any
            this.chart4Option.series[0].data.push([x, y])
            break;
          }
      }
    })
  }

  clearChartData() {
    this.chart1Option.series[0].data = []
    this.chart2Option.series[0].data = []
    this.chart3Option.series[0].data = []
    this.chart4Option.series[0].data = []
  }

  public onDataUpdated() {
    this.setDataObject()
    this.setChartOptions()
    this.chart1?.onDataUpdated()
    this.chart2?.onDataUpdated()
    this.chart3?.onDataUpdated()
    this.chart4?.onDataUpdated()
  }

  public resize() {
    this.chart1?.resize()
    this.chart2?.resize()
    this.chart3?.resize()
    this.chart4?.resize()
  }
}