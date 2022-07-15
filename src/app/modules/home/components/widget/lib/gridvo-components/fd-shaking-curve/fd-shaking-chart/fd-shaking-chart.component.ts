import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { EChartsOption } from 'echarts';
import { debounce } from "@gwhome/common/utils/debounce";
@Component({
  selector: 'tb-fd-shaking-chart',
  templateUrl: './fd-shaking-chart.component.html',
  styleUrls: ['./fd-shaking-chart.component.scss']
})
export class FdShakingChartComponent implements OnInit {
  @Input() chartOption: EChartsOption
  echartsInstance: echarts.ECharts = null
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  // 设置echarts配置项
  public setOptions() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.chartOption)
      this.cd.detectChanges()
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
