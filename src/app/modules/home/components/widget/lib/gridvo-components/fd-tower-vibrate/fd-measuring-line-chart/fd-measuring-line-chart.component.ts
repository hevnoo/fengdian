import { Component, OnInit, Input } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import { debounce } from "@gwhome/common/utils/debounce";

@Component({
  selector: 'tb-fd-measuring-line-chart',
  templateUrl: './fd-measuring-line-chart.component.html',
  styleUrls: ['./fd-measuring-line-chart.component.scss']
})
export class FdMeasuringLineChartComponent implements OnInit {
  @Input() ctx: WidgetContext
  @Input() chartOption: EChartsOption = {}
  echartsInstance: echarts.ECharts = null
 
  constructor() { }

  ngOnInit(): void {
    this.ctx.$scope.FdMeasuringLineChart = this
  }

  // 设置echarts配置项
  public setOptions() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.chartOption)
      this.ctx.detectChanges()
    }
  }

  public onDataUpdated() {
    this.setOptions()
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
