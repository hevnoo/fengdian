import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { isDefined } from '@core/utils';
import { ThemeService } from '@app/core/services/theme.server';

@Component({
  selector: 'tb-fd-ring-chart',
  templateUrl: './fd-ring-chart.component.html',
  styleUrls: ['./fd-ring-chart.component.scss']
})
export class FdRingChartComponent implements OnInit {

  @Input() ctx: WidgetContext;
  @Input() chartData: []
  @ViewChild("ringChart") ringChart: ElementRef;

  public chartDom: any;
  public myChart: any;
  public chartOption: EChartsOption;
  public chartTitle: string;
  public tooltipBgColor: string; // 提示框背景及边框颜色
  public tooltipColor: string;    // 提示框文字颜色
  public legendWidth: number;  // 系列标记宽度
  public legendTop: number;  // 系列标记距离顶部的距离
  public legendRight: number; // 系列标记距离右侧的距离
  public radiusVal: string;  // 内外圈半径值
  public radiusArr: any[];
  public emphasisLabel: number;  // 高亮效果的提示词字体大小
  public emphasisScaleSize: number; // 高亮扇区的放大尺寸
  public scaleColorArr: any[];
  public scaleColor: any[] = []; // 扇区的颜色
  public chartLeft: string;  // charts组件距离左侧的位置
  public dataArr: any[] = [];   // Option数据项
  public unitOfChart: string = ""


  constructor(private themeService: ThemeService) { }


  ngOnInit(): void {
    this.ctx.$scope.ringChartWidget = this
    this.initData()
    this.echartInit()
  }

  ngAfterViewInit() {
    this.initSettings()
  }

  echartInit() {
    if (this.ringChart?.nativeElement) {
      echarts.init(this.ringChart.nativeElement).dispose()
      this.myChart = echarts.init(this.ringChart.nativeElement);
    }
  }

  initSettings() {
    const settings = this.ctx.widgetConfig.settings
    this.chartTitle = settings.title || ''
    this.tooltipBgColor = this.themeService.getActiveTheme().properties["--dark-seven"]
    this.tooltipColor = this.themeService.getActiveTheme().properties["--white-1"]
    this.legendWidth = settings.legendWidth || 10
    this.legendTop = settings.legendTop || 25
    this.legendRight = settings.legendRight || 10
    this.radiusVal = settings.radius || '50, 70'
    this.radiusArr = this.radiusVal.split(',')
    this.emphasisLabel = settings.emphasisLabel || 20
    this.emphasisScaleSize = settings.emphasisScaleSize || 15
    this.chartLeft = settings.chartLeft || 10
    this.scaleColorArr = isDefined(settings.scaleList) ? settings.scaleList : []
    this.scaleColorArr.forEach((item) => {
      if (this.scaleColor) this.scaleColor.push(Object.values(item).join());
    })
    this.unitOfChart = settings.unitOfChart || ""
  }

  initData() {
    this.ctx.data?.forEach(item => {
      // console.log(item + ', '+item.data.length);
      let dataObj = {
        name: item.dataKey.label,
        value: item.data[item.data.length - 1]?.[1] || 0,
        itemStyle: {
          color: item.dataKey.color
        }
      }
      this.dataArr.push(dataObj)
    })

    this.chartOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: this.tooltipBgColor,
        borderColor: this.tooltipBgColor,
        formatter: `{b}: {c}${this.unitOfChart}({d}%)`,
        textStyle: {
          color: this.tooltipColor
        }
      },
      legend: {
        width: `${this.legendWidth}%`,
        top: `${this.legendTop}%`,
        right: `${this.legendRight}%`,
      },
      series: [{
        type: 'pie',
        radius: this.radiusArr,
        label: {
          show: false,
          position: 'center',
          color: '2341415'
        },
        left: this.chartLeft + '%',
        emphasis: {
          label: {
            show: true,
            fontSize: `${this.emphasisLabel}`,
            fontWeight: 'bold'
          },
          scale: true,
          scaleSize: this.emphasisScaleSize,
        },
        labelLine: {
          show: false
        },
        data: this.dataArr
      }]

    }

  }

  resizeChart() {
    if (this.myChart) {
      this.myChart.resize();
    }
  }

  public onDataUpdated() {
    this.scaleColor = []
    this.dataArr = []
    this.initData()
    if(this.myChart) {
      this.myChart.setOption(this.chartOption);
    }
    this.ctx.detectChanges();
  }

}
