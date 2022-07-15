import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { debounce } from "@gwhome/common/utils/debounce";

@Component({
  selector: 'tb-fd-swing-rose-chart',
  templateUrl: './fd-swing-rose-chart.component.html',
  styleUrls: ['./fd-swing-rose-chart.component.scss']
})
export class FdSwingRoseChartComponent implements OnInit, AfterViewInit {
  @Input() ctx: WidgetContext

  directionNameList: Array<string> = ['E', '东东北', '东北', '北北东', 'N', '北北西', '西北', '西西北', 'W', '西西南', '西南', '南南西', 'S', '南南东', '东南', '东东南']
  echartsInstance: echarts.ECharts = null
  chartOption: EChartsOption = {
    title: {
      text: '测点摆幅玫瑰图'
    },
    tooltip: {
      show: true,
      confine: true,
      formatter: (e) => {
        let value = e.value
        let str = `<span>玫瑰图</span><br/>`
        value.forEach((item, index) => {
          if (index < this.directionNameList.length) {
            str += `
            <span style="display: flex; justify-content: space-between">
              <span>${this.directionNameList[index]}：&nbsp;&nbsp;&nbsp;</span>
              <span>${item}</span>
            </span>`
          }
        })
        return str;
      }
    },
    radar: {
      shape: 'circle',
      startAngle: 0,
      indicator: [
        // 依照返回数据排列，数据从东边开始，逆时针方向
        { name: 'E', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: 'N', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: 'W', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: 'S', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
        { name: '', max: 25 },
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        symbol: 'none',
        data: [
          {
            value: [10, 11, 1, 9, 2, 11, 15, 2, 5, 10, 21, 8, 22, 8, 4, 9],
            name: '玫瑰图',
            areaStyle: {},
          },
        ]
      }
    ]
  }

  constructor() { }

  ngOnInit(): void {
    this.ctx.$scope.FdSwingRoseChart = this
  }

  ngAfterViewInit(): void {
    this.setOptions()
  }

  public onDataUpdated() {
    try {
      const ctxData = JSON.parse(this.ctx.data[0].data[0][1])
      this.chartOption.series[0].data[0].value = ctxData.length ? ctxData : new Array(this.directionNameList.length).fill(0)
    } catch {
      this.chartOption.series[0].data[0].value = new Array(this.directionNameList.length).fill(0)
    }
    // @ts-ignore
    const max = Math.max(...this.chartOption.series[0].data[0].value)
    // @ts-expect-error
    this.chartOption.radar.indicator.forEach((i) => {
      i.max = max
    })
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
