import { Component, OnInit, ViewChild, ElementRef ,Input,Renderer2} from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'tb-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export class BaseChartComponent implements OnInit {
  @Input() ctx: WidgetContext
  @Input() chartOption: EChartsOption
  @ViewChild("baseChart") baseChart: ElementRef
  public myChart: any;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.ctx.$scope.baseChartWidget = this
  }
  ngAfterViewInit() {
    this.echartInit()
  }

  echartInit() {
    if (this.baseChart?.nativeElement) {
      this.renderer.setStyle(this.baseChart.nativeElement, 'width', '100%');
      this.renderer.setStyle(this.baseChart.nativeElement, 'height', '100%');
      echarts.init(this.baseChart.nativeElement).dispose()
      this.myChart = echarts.init(this.baseChart.nativeElement);
    }
  }
  resizeChart() {
    if (this.myChart) {
      this.myChart.resize();
    }
  }

  public onDataUpdated() {
    if (this.myChart) {
      this.myChart.clear()      
      this.myChart.setOption(this.chartOption);
    }
    this.ctx.detectChanges();
  }

}
