import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { debounce } from '../../common/utils';

@Component({
  selector: 'tb-fd-measuring-point-chart',
  templateUrl: './fd-measuring-point-chart.component.html',
  styleUrls: ['./fd-measuring-point-chart.component.scss']
})
export class FdMeasuringPointChartComponent implements OnInit, AfterViewInit {
  @Input() ctx: WidgetContext

  echartsInstance: echarts.ECharts = null
  thresholdData = [] // 阈值
  measuringData: number[][] = [[]]

  chartOption: EChartsOption = {
    grid: {
      bottom: "50%"
    },
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      },
      confine: true
    },
    title: {
      text: '顶部测点'
    },
    xAxis: {
      type: 'time',
      name: "T(ms)"
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
        data: this.measuringData,
      },
      {
        name: '阈值',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: this.thresholdData,
        lineStyle: {
          color: "red"
        },
        itemStyle: {
          color: "red"
        }
      }
    ]
  }
  constructor() {}

  ngOnInit(): void {
    this.ctx.$scope.FdMeasuringPointChart = this
    // @ts-expect-error
    this.chartOption.title.text = this.ctx.settings.title
  }

  ngAfterViewInit(): void {
    this.setOptions()
  }

  public onDataUpdated() {
    let md = [] // measuringData
    let td = [] // thresholdData
    this.ctx.data.forEach(i => {
      i.data.forEach(j => {
        md.push(j)
        td.push([j[0], 300])
      })
    })
    this.chartOption.series[0].data = md
    this.chartOption.series[1].data = td
    this.setOptions()
  }

  // 设置echarts配置项
  public setOptions() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.chartOption)
      this.ctx.detectChanges()
    }
  }

  // resize chart
  public resize() {
    if (this.echartsInstance) {
      debounce(this.echartsInstance.resize, 100, true)
    }
  }

  // echarts初始化
  onChartInit(ec: echarts.ECharts): void {
    this.echartsInstance = ec
  }
}
