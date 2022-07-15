import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { isDefined } from "@app/core/utils";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import * as echarts from 'echarts'
import { EChartsOption } from "echarts";


@Component({
    selector: 'tb-app-daily-work',
    templateUrl: './app-daily-work.component.html',
    styleUrls: ['./app-daily-work.component.scss']
  })
export class FdAppDailyWorkComponent implements OnInit {
    @Input() ctx: WidgetContext
    @ViewChild("StackBar") stackBar: ElementRef

    public myChart: any;
    public chartOption: EChartsOption;
    public title: string
    public xAxiosData: string
    public xAxiosArr: any

    ngOnInit(): void {
        this.ctx.$scope.dailyWork = this
        this.initSetting()
        this.initData()
    }

    ngAfterViewInit() {
        this.echartInit()
    }
    
    echartInit() {
        if (this.stackBar?.nativeElement) {
            echarts.init(this.stackBar.nativeElement).dispose()
            this.myChart = echarts.init(this.stackBar.nativeElement);
        }
    }

    initSetting() {
        const settings = this.ctx.widgetConfig.settings
        this.title = isDefined(settings.title) ? settings.title : '请输入部件标题'
        this.xAxiosData = isDefined(settings.xData) ? settings.xData : ''
        this.xAxiosArr= this.xAxiosData.split(',')
    }

    initData() {
        console.log(this.ctx.data);
        // console.log(this.ctx.datasources);
        
        let dataArr
        let seriesData = []
        let xData = []
        let obj = {}
        this.xAxiosArr.forEach(item => {
            obj[item] = 0
        })
        this.ctx.data.forEach((item) => {
            console.log('数据', item, item?.data[item?.data?.length - 1]?.[1]);
            obj[item.dataKey?.label] = item?.data[item?.data?.length - 1]?.[1] || 0
           
        } )
        console.log("数据", obj);
        
        dataArr = Object.entries(obj)
        for( let [key, value] of dataArr ) {
            xData.push(key)
            seriesData.push(value)
        }
        this.chartOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: xData
            },
            grid: {
                top: '20%',
                right: '20%',
                bottom: '25%',
                left: '20%'
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
                name: '数量',
                minInterval: 1
            },
            series: {
                name: '数量',
                type: 'bar',
                data: seriesData
            }
        }
        
    }

    resizeChart() {
        if (this.myChart) {
            this.myChart.resize();
        }
    }

    public onDataUpdate() {
        this.initData()
        this.myChart.setOption(this.chartOption, true)
        this.ctx.detectChanges()
    }
}