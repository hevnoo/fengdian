import { Component, OnInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-liquidfill'
import { WidgetContext } from '@home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import { isDefined } from '@core/utils';
import {
  WidgetConfig
} from '@shared/models/widget.models';

@Component({
  selector: 'tb-fd-liquidfill-chart',
  templateUrl: './fd-liquidfill-chart.component.html',
  styleUrls: ['./fd-liquidfill-chart.component.scss']
})
export class FdLiquidfillChartComponent implements OnInit {
  @Input() ctx: WidgetContext
  @Input() statisticNum: number[]
  @Input() labelFontSize: number
  public widgetConfig: WidgetConfig;
  public defaultOption
  public chartDom
  public myChart
  constructor() { }

  ngOnInit(): void {
    this.ctx.$scope.liquifillChartWidget = this
    this.widgetConfig = this.ctx.widgetConfig;
    this.myChart = echarts.init(this.ctx.$containerParent.find('.fd-liqui-chart')[0]);
    this.initData()
  }

  initData() {
    this.defaultOption = {
      series: [{
        type: 'liquidFill',
        radius: '98%',
        center: ['50%', '50%'],
        data: this.statisticNum || [0.6],
        // color: ['#209DDC'],
        color: [{
          type: 'linear',
          x: 0,
          y: 1,
          x2: 0,
          y2: 0,
          colorStops: [{
            offset: 1,
            color: ['#00D5FF'], // 0% 处的颜色
          }, {
            offset: 0,
            color: ['#0059FF'], // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }],
        outline: {
          show: false,
        },
        label: {
            fontSize: this.labelFontSize || 14,
            color: '#000000'
        },
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 1,
              color: ['#9EC3E9'], // 0% 处的颜色
            }, {
              offset: 0.5,
              color: ['#F4F8FC'], // 100% 处的颜色
            },
            {
              offset: 0,
              color: ['#FFFFFF'], // 100% 处的颜色
            }],
          }
        },
      }]
    };
  }
  public onDataUpdated() {
    this.initData()
    this.myChart.setOption(this.defaultOption);
    this.ctx.detectChanges();
  }

  resizeChart() {
    if (this.myChart) {
      this.myChart.resize();
    }
  }

}
