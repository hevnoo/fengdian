import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { EChartsOption } from 'echarts';
import * as echarts from "echarts";
import { isDefined } from "@app/core/utils";
@Component({
    selector: "tb-fd-realTime-chart",
    templateUrl: "./fd-realTime-chart.component.html",
    styleUrls: ["./fd-realTime-chart.component.scss"],
})
export class FdRealTimeChartComponent implements OnInit {
    @Input() ctx: WidgetContext;
    // @Input() chartOption: EChartsOption;
    @ViewChild("baseChart") baseChart: ElementRef;

    public myChart: any;
    public chartOption: EChartsOption;
    public chartType: any;
    public yName: string;
    constructor() { }

    ngOnInit(): void {
        this.ctx.$scope.baseChart = this
        this.initSetting()
        this.initData()
    }

    ngAfterViewInit() {
        this.echartInit();
    }

    echartInit() {
        console.log(this.baseChart, "baseChart")
        if (this.baseChart?.nativeElement) {
            echarts.init(this.baseChart.nativeElement).dispose()
            this.myChart = echarts.init(this.baseChart.nativeElement);
        }
    }

    initSetting() {
        const settings = this.ctx.widgetConfig.settings
        this.chartType = isDefined(settings.chartType) ? settings.chartType : 'line'
        this.yName = isDefined(settings.yName) ? settings.yName : ''
    }

    initData() {
        let dataArr = []
        let seriesName
        this.ctx.data.forEach(item => {
            console.log(item, "实时测试");
            
            dataArr = item?.data
            seriesName = item?.dataKey?.label
        })
        this.chartOption = {
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                top: "10%",
                bottom: "15%",
                left: "10%",
                right: "10%"
            },
            xAxis: {
                type: 'time',
                // boundaryGap: ["0", "0.5"]  //  TODO
                // axisLabel: { 
                //     interval: 0
                // }
            },
            yAxis: {
                type: "value",
                name: this.yName
            },
            series: {
                name: seriesName,
                type: this.chartType,
                symbol: 'none',
                smooth: true,
                data: dataArr
            }
        }
        console.log(this.chartOption, "this-chartOption")
    }

    reSize() {
        if (this.myChart) {
            this.myChart.resize()
        }
    }

    public onUpData() {
        this.initData()
        if (this.myChart) {
            this.myChart.setOption(this.chartOption)
        }
        this.ctx.detectChanges
    }

}