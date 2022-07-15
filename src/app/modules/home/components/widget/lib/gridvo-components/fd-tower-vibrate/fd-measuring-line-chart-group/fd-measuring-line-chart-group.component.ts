import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { deepClone } from '@app/core/utils';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import { FdMeasuringLineChartComponent } from '../fd-measuring-line-chart/fd-measuring-line-chart.component';
import { AttributeService } from "@core/http/attribute.service";
import { AttributeScope } from "@shared/models/telemetry/telemetry.models";
import { Datasource } from '@app/shared/models/widget.models';

@Component({
  selector: 'tb-fd-measuring-line-chart-group',
  templateUrl: './fd-measuring-line-chart-group.component.html',
  styleUrls: ['./fd-measuring-line-chart-group.component.scss']
})
export class FdMeasuringLineChartGroupComponent implements OnInit {
  @Input() ctx: WidgetContext
  @ViewChild('chart1') chart1: FdMeasuringLineChartComponent
  @ViewChild('chart2') chart2: FdMeasuringLineChartComponent
  @ViewChild('chart3') chart3: FdMeasuringLineChartComponent
  attrNameMap: Map<string, any> = new Map()

  chart1Option: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      },
      confine: true
    },
    title: {
      text: '测点摆幅-时间曲线'
    },
    xAxis: {
      type: 'time',
      name: "时间(s)"
    },
    yAxis: {
      type: 'value',
      name: '摆幅(mm)'
    },
    series: [
      {
        name: '摆幅',
        type: 'line',
        smooth: true,
        data: [],
      }
    ]
  }

  chart2Option: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      },
      confine: true
    },
    title: {
      text: '测点1摆幅、风速-时间曲线'
    },
    xAxis: {
      type: 'time',
      name: "时间(s)"
    },
    yAxis: {
      type: 'value',
      name: '摆幅(mm)'
    },
    series: [
      {
        name: '测点',
        type: 'line',
        smooth: true,
        data: [],
      }
    ]
  }

  chart3Option: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      },
      confine: true
    },
    title: {
      text: '测点1摆幅功率-时间曲线'
    },
    xAxis: {
      type: 'time',
      name: "时间(s)"
    },
    yAxis: {
      type: 'value',
      name: '摆幅(mm)'
    },
    series: [
      {
        name: '测点',
        type: 'line',
        smooth: true,
        data: [],
      }
    ]
  }
  constructor(private attributeService: AttributeService) { }

  ngOnInit(): void {
    this.ctx.$scope.FdMeasuringLineChartGroup = this
    let arr: Datasource[] = []
    Promise.all(this.ctx.datasources.map(i => {
      arr.push(i)
      return this.attributeService.getEntityAttributes(i.entity.id, AttributeScope.SERVER_SCOPE).toPromise()
    })).then(values => {
      values.forEach((i, index) => {
        let label = ""
        let sort = 0
        i.forEach(j => {
          if (j.key === "sensorPosition") {
            label = `测点${j.value}`
            sort = j.value
          }
        })
        this.attrNameMap.set(arr[index].name, { label: label, sort: sort })
      })
      this.setOptions()
    })
  }

  public setOptions() {
    // set 1 2 3 chart option
    let chart1Arr = []
    let windSpeedData = []
    let powerData = []
    this.ctx.data.forEach(i => {
      if (i.dataKey.name === "off") {
        // 摆幅（偏移量）
        if (this.attrNameMap.get(i.datasource.name)) {
          const { label, sort } = this.attrNameMap.get(i.datasource.name)
          chart1Arr.push({ ...i, text: label, sort: sort })
        }
      }
      if (i.dataKey.name === "wind_speed") {
        // 风速
        windSpeedData = i.data
      }
      if (i.dataKey.name === "power") {
        // 功率
        powerData = i.data
      }
    })

    const _chart1Sort = chart1Arr.sort((a, b) => a.sort - b.sort)
    const _chart1Series = []
    _chart1Sort.forEach(i => {
      _chart1Series.push({
        name: i.text,
        type: "line",
        smooth: true,
        data: i.data
      })
    })
    this.chart1Option.series = _chart1Series
    if (this.ctx.$scope.searchValue) {
      (this.chart2Option.title as any).text = `${this.ctx.$scope.searchValue.measuringValue}摆幅、风速-时间曲线`;
      (this.chart3Option.title as any).text = `${this.ctx.$scope.searchValue.measuringValue}摆幅功率-时间曲线`;
      const seriesData = _chart1Series.filter(i => i.name === this.ctx.$scope.searchValue.measuringValue)
      this.chart2Option.series = deepClone(seriesData)
      this.chart3Option.series = deepClone(seriesData)
    } else {
      const seriesData = _chart1Series.filter(i => i.name === "测点1")
      this.chart2Option.series = deepClone(seriesData)
      this.chart3Option.series = deepClone(seriesData)
    }
    if (this.chart1Option.series?.[0]?.name) {
      this.chart1Option.series[0].name = "摆幅"
    }
    if (this.chart2Option.series?.[0]?.name) {
      this.chart2Option.series[0].name = "摆幅"
    }
    if (this.chart3Option.series?.[0]?.name) {
      this.chart3Option.series[0].name = "摆幅"
    }
    this.chart2Option.series[1] = { name: "风速", type: "line", data: windSpeedData }
    this.chart3Option.series[1] = { name: "功率", type: "line", data: powerData }
  }

  public onDataUpdated() {
    this.setOptions()
    this.chart1.onDataUpdated()
    this.chart2.onDataUpdated()
    this.chart3.onDataUpdated()
  }

  public resize() {
    this.chart1.resize()
    this.chart2.resize()
    this.chart3.resize()
  }
}
