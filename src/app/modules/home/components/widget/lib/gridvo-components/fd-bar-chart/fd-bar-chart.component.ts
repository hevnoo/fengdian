import { DatePipe } from "@angular/common";
import { ItemBufferService } from "@core/services/item-buffer.service";
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { isDefined } from "@app/core/utils";
import { ThemeService } from "@app/core/services/theme.server";
import { data } from "jquery";
import { DashboardService } from "@app/core/http/dashboard.service";

@Component({
  selector: "tb-fd-bar-chart",
  templateUrl: "./fd-bar-chart.component.html",
  styleUrls: ["./fd-bar-chart.component.scss"],
})
export class FdBarChartComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @ViewChild("barChart") barChart: ElementRef;
  dimensionsSourceArr = [];
  public chartDom: any;
  public myChart: any;
  public chartOption: EChartsOption;
  public chartTitle: string;
  public tooltipBgColor: string; // 提示框背景及边框颜色
  public tooltipColor: string; // 提示框文字颜色
  public xAxisData: any[] = []; // x轴标签数据
  public xAxisLabelRotate: number; // x轴标签旋转角度
  public yAxisName: string; // y轴单位
  public chartType: any; // 图表类型(可选bar或line)
  public dataList: number[]; // 数据列表
  public seriesArr: any[] = [];
  public areaStyleColorStart: string; // 区域填充样式开始的颜色(为设置渐变色)
  public areaStyleColorEnd: string; // 区域填充样式结束的颜色(为设置渐变色)
  public isAreaStyle: boolean; // 是否要开启区域填充样式
  public isLegend: boolean; // 是否开启图例
  public gridVal: string; // 图表距离上左右下的距离
  public gridArr: string[];
  public borderRadiusVal: string; // 柱状图表的四角弧度
  public borderRadiusArr: number[] = [];
  public legendData = [];
  public splitNum = 24;
  constructor(private themeService: ThemeService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.ctx.$scope.barChartWidget = this;
    this.initSetting();
    this.initData();
  }

  ngAfterViewInit() {
    this.echartInit();
  }

  echartInit() {
    if (this.barChart?.nativeElement) {
      echarts.init(this.barChart.nativeElement).dispose();
      this.myChart = echarts.init(this.barChart.nativeElement);
    }
  }

  initSetting() {
    const settings = this.ctx.widgetConfig.settings;
    this.chartTitle = settings.chartTitle || "请输入部件标题";
    this.xAxisLabelRotate = settings.xAxisLabelRotate || 0;
    this.chartType = settings.chartType || "line";
    this.areaStyleColorStart = this.themeService?.getActiveTheme()?.properties[
      "--pinkRed-1"
    ];
    this.areaStyleColorEnd = this.themeService?.getActiveTheme()?.properties[
      "--white-1"
    ];
    this.tooltipBgColor = this.themeService?.getActiveTheme()?.properties[
      "--dark-seven"
    ];
    this.tooltipColor = this.themeService?.getActiveTheme()?.properties[
      "--white-1"
    ];
    this.isAreaStyle = isDefined(settings.isAreaStyle)
      ? settings.isAreaStyle
      : false;
    this.isLegend = isDefined(settings.isLegend) ? settings.isLegend : true;
    console.log(this.isLegend, "图例");
    this.gridVal = settings.gridVal || "10,10,10,20";
    this.yAxisName = settings.yAxisName || "";
    this.gridArr = this.gridVal.split(",");
    this.borderRadiusVal = settings.borderRadiusVal || "15,15,15,15";
    this.borderRadiusArr = this.borderRadiusVal
      .split(",")
      .map((item) => parseInt(item));
  }

  // 计算两个时间差 dateBegin 开始时间
  timeFn() {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    //时间戳
    var dateBegin = new Date(this.ctx.timeWindow.maxTime);
    var dateEnd = new Date(this.ctx.timeWindow.minTime);
    var dateDiff = dateBegin.getTime() - dateEnd.getTime(); //时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    return { dayDiff };
  }

  // 数据根据date/month/year进行转换
  convertData() {
    let dimensionsObj = {};
    let currentData = [];
    let currentTimeType = JSON.parse(
      window.localStorage.getItem("chooseTimeType")
    );
    let specialKeyNameArr = this.ctx.settings.specialKeyName?.split(",");
    let jsonRule = null;
    if (this.ctx.settings.ruleForSpecialKey) {
      jsonRule = JSON.parse(this.ctx.settings.ruleForSpecialKey);
    }
    this.ctx.data.forEach((item) => {
      let _index = specialKeyNameArr?.indexOf(item.dataKey.label);
      if (_index > -1) {
        if (
          jsonRule?.[item.dataKey.label]?.[currentTimeType] ===
          item.dataKey.name
        ) {
          currentData.push(item);
        }
      }
    });
    currentData.forEach((item) => {
      let isHas = true;
      isHas = dimensionsObj[item.datasource?.name] ?? false;
      if (isHas) {
        dimensionsObj[item.datasource?.name]["name"] = item.dataKey?.label;
        dimensionsObj[item.datasource?.name][item.dataKey?.name] =
          item.data?.[item.data.length - 1]?.[1];
        // console.log('wqm111', item['data'],item)
        dimensionsObj[item.datasource?.name]["val"] = item.data;
      } else {
        dimensionsObj[item.datasource?.name] = {};
        dimensionsObj[item.datasource?.name]["name"] = item.dataKey?.label;
        dimensionsObj[item.datasource?.name][item.dataKey?.name] =
          item.data?.[item.data.length - 1]?.[1];
        // console.log('wqm111', item['data'],item)
        dimensionsObj[item.datasource?.name]["val"] = item.data; //val这个是给指标分析的用的
      }
    });

    this.dimensionsSourceArr = Object.values(dimensionsObj);
    console.log("wqm-currentTimeType", currentTimeType);
    console.log("wqm-ctx.data", this.ctx.data);
    console.log("wqm-currentData", currentData);
    console.log("wqm-dimensionsObj", dimensionsObj);
    console.log("wqm-this.dimensionsSourceArr", this.dimensionsSourceArr);
  }
  initData() {
    this.convertData();

    // this.xAxisData = []
    //月
    // if (JSON.parse(window.localStorage.getItem("chooseTimeType")) == 'month') {
    //   this.splitNum = 31
    // }
    // //年
    // else if (JSON.parse(window.localStorage.getItem("chooseTimeType")) == 'year') {
    //   this.splitNum = 12
    // }
    // //日
    // else {
    //   this.splitNum = 24
    // }
    // let now_data = new Date()
    // let year_now = now_data.getFullYear(), month_now = now_data.getMonth() + 1, day_now = now_data.getDate();
    // let test =  now_data.setDate(now_data.getDate()+1);
    // let time_min = `${year_now}/${month_now}/${day_now} 00:00:00`;
    // let time_max = this.datePipe.transform(test, 'YYYY-MM-DD')+' 00:00:00';
    this.dimensionsSourceArr?.forEach((item) => {
      this.dataList = [];
      this.dataList.push(item?.val);
      let seriesData = {
        type: this.chartType,
        name: item?.name || "",
        data: item?.val,
      };
      this.seriesArr.push(seriesData);
    });

    if (this.isAreaStyle) {
      this.seriesArr.forEach((item) => {
        item.areaStyle = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: this.areaStyleColorStart,
            },
            {
              offset: 1,
              color: this.areaStyleColorEnd,
            },
          ]),
        };
      });
    }
    this.chartOption = {
      legend: {
        show: this.isLegend,
      },
      grid: {
        top: `${this.gridArr[0]}%`,
        left: `${this.gridArr[1]}%`,
        right: `${this.gridArr[2]}%`,
        bottom: `${this.gridArr[3]}%`,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: this.tooltipBgColor,
        borderColor: this.tooltipBgColor,
        textStyle: {
          color: this.tooltipColor,
        },
        // position: function (pos, params, el, elRect, size) {
        //   var obj = { top: 10 };
        //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
        //   return obj;
        // },
      },
      xAxis: {
        type: "time",
        // splitNumber: this.splitNum,
        splitLine: {
          show: false,
        },
        // axisTick: {
        //   interval: auto
        // },
        axisLabel: {
          rotate: this.xAxisLabelRotate,
          formatter: function (params) {
            let data = new Date(params);
            let year = data.getFullYear();
            let month = data.getMonth() + 1;
            let date = data.getDate();
            let hours = data.getHours();
            let minute = data.getMinutes();
            let ss = data.getSeconds();
            if (
              JSON.parse(window.localStorage.getItem("chooseTimeType")) ==
              "month"
            ) {
              return date + "";
            }
            if (
              JSON.parse(window.localStorage.getItem("chooseTimeType")) ==
              "year"
            ) {
              return month + "-" + date;
            }
            return hours + ":" + minute + ":" + ss;
            // return new Date(params).getHours().toString()
          },
        },
        // // maxInterval: 1
        data: [],
      },
      yAxis: {
        type: "value",
        name: this.yAxisName,
      },
      series: this.seriesArr,
    };
    console.log(this.chartOption);
  }

  resizeChart() {
    if (this.myChart) {
      this.myChart.resize();
    }
  }

  public onDataUpdated() {
    this.seriesArr = [];
    this.initData();
    this.myChart.setOption(this.chartOption);
    this.ctx.detectChanges();
  }
}
