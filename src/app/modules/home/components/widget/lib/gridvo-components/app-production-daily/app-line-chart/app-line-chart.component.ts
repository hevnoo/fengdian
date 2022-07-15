import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { EChartsOption } from "echarts";
import * as echarts from 'echarts';
import { isDefined } from "@app/core/utils";

@Component({
    selector: 'tb-app-line-chart',
    templateUrl: './app-line-chart.component.html',
    styleUrls: ['./app-line-chart.component.scss']
})
export class FdAppLineChartComponent implements OnInit {
    @Input() ctx: WidgetContext;
    @ViewChild('lineChart') lineChart: ElementRef

    public myChart: any;
    public chartOption: EChartsOption;
    public legendData = []
    public seriesData = []
    public dataList = []
    public yAxiosArr = []    // 设置多y轴
    public xAxiosData = []
    public title: string

    ngOnInit(): void {
        this.ctx.$scope.lineChartWidget = this
        this.initSetting()
        this.initData()
    }

    ngAfterViewInit() {
        this.echartInit()
    }
    
    echartInit() {
        if (this.lineChart?.nativeElement) {
            echarts.init(this.lineChart.nativeElement).dispose()
            this.myChart = echarts.init(this.lineChart.nativeElement);
        }
    }

    initSetting() {
        let settings = this.ctx.widgetConfig.settings || []
        this.yAxiosArr = isDefined(settings.yAxios) ? settings.yAxios : [{name: '', type: 'value'}]
        this.title = isDefined(settings.title) ? settings.title : '请输入标题'
    }

    initData() {

        let currentData = {}
        for (let i = 0; i < 24; i++) {
            currentData[i+1] = 0;
        }
        this.ctx.data.forEach((item, i) => {
            // console.log(item.data, "数据源");
            
            this.legendData.push(item.dataKey.label)
            this.dataList = []
            item.data.forEach(itemx => {
                 itemx[0] = Number(window.moment(itemx[0]).format("H"))
            })
            item.data.forEach(itemy => {
                currentData[itemy[0]] = itemy[1] === null ?  0:itemy[1];
            })
            // console.log(currentData, "testData")
            this.xAxiosData = Object.keys(currentData)
            let serie = {
                type: 'line',
                itemStyle: {
                    color: item.dataKey.color,
                }, 
                name: item.dataKey.label,
                data: Object.values(currentData),
                yAxisIndex: i
                
            }
            this.seriesData.push(serie)
            
        })
        this.chartOption = {
            legend: {
                show: true,
                data: this.legendData
            },
            tooltip: {
                show: true
            },
            grid: {
                left: 60,
                top: 50,
                right: 40,
                bottom: 40
            },
            xAxis: {
                type: 'category',
                data: this.xAxiosData,
                axisTick: {
                    alignWithLabel: true 
                }
            },
            yAxis: this.yAxiosArr,
            series: this.seriesData
        }
        // console.log('option!!', this.chartOption);
        
    }

    resizeChart() {
        if (this.myChart) {
            this.myChart.resize();
        }
    }
    
    public onDataUpdated() {
        this.legendData = []
        this.dataList = []
        this.seriesData = []
        this.initData()
        // console.log(this.myChart);
        
        this.myChart.setOption(this.chartOption);
        this.ctx.detectChanges();
    }
}