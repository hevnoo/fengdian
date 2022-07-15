import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { isDefined } from "@core/utils";
import { WidgetConfig } from "@shared/models/widget.models";
import lo2 from "@gwhome/common/utils/Cache";

// 通用的 可排序的柱状图标  2022.2.22一些用不上的option后续删除

@Component({
  selector: "tb-fd-bar-chart-v2",
  templateUrl: "./fd-bar-chart-v2.component.html",
  styleUrls: ["./fd-bar-chart-v2.component.scss"],
})
export class FdBarChartV2Component implements OnInit, OnChanges {
  @Input() ctx: WidgetContext;
  @Input() dimensionsSourceArr: [{}];
  @Input() unitOfChart: string = "";
  @Input() finalArr: any[];
  @Input() isRealTimeChart: boolean = false; //用于标识动态数据图表
  @ViewChild("barchart") barchart: ElementRef;
  public widgetConfig: WidgetConfig;
  public chartDomOfBar: any;
  public myBarChart: any;
  isLegend: boolean;
  public chartOption: EChartsOption;
  // 配置项
  public gridSetting: number[];
  public sortType: string = "desc";
  public chartTitle: string = "";
  public sortField: string = "name";
  public chartType: any = "bar";
  public chartAxisLabelColor: any = "grey";
  public describeOfChart: string = "";
  public chartAxisType: any = "category";
  public isFormatToArray: boolean = false;
  public StyleOfchar: string = localStorage.getItem("themeValue") || "dark";
  public chartAxisLineColor: any = "grey";
  public legendTextStyle: string = "red";
  public selectStyle: string = ""; //区分是否是大屏样式
  public rotate: number = 0;
  color: string;
  titleColor: string;

  // 图表柱状图颜色
  private colorMap: Map<string, string> = new Map().set(
    "ljfengdian",
    "rgba(10, 153, 210, 1)"
  ); //华电

  // 轴标签颜色
  private chartAxisLabelColorMap: Map<string, string> = new Map().set(
    "ljfengdian",
    "rgba(0, 0, 0, 0.65)"
  ); //华电

  // x轴轴线颜色
  private chartAxisLineColorMap: Map<string, string> = new Map().set(
    "ljfengdian",
    "rgba(0, 0, 0, 0.65)"
  ); //华电

  // 标题颜色
  private titleColorMap: Map<string, string> = new Map().set(
    "ljfengdian",
    "rgba(0, 0, 0, 0.85)"
  ); //华电

  // 图例文字颜色
  private legendTextStyleMap: Map<string, string> = new Map().set(
    "ljfengdian",
    "rgba(1, 23, 62, 1)"
  ); //华电

  constructor(private renderer: Renderer2) {}

  resultArr = [{ name: "YF006", ThisMonth_pg: "25.21", val: "25.21" }];
  // catchValue(arr) {
  //   lo2.setCache("v2", arr);
  //   console.log("change:", lo2.getCache("v2"));
  //   this.ctx.detectChanges();
  // }
  ngOnChanges(changes: SimpleChanges): void {
    // this.resultArr = lo2.getCache("v2") || [
    //   { name: "YF006", ThisMonth_pg: "25.21", val: "25.21" },
    // ];
    // console.log("change", changes.finalArr?.currentValue?.[0]);
    // if (changes.finalArr?.currentValue?.[0].ThisMonth_pg) {
    //   this.resultArr = changes.finalArr?.currentValue;
    //   this.catchValue(this.resultArr);
    // } else if (changes.currentValue?.[0].ThisYear_pg) {
    //   console.log("year");
    //   this.resultArr = changes.finalArr?.currentValue;
    //   this.catchValue(this.resultArr);
    // } else if (changes.currentValue?.[0].DayPG) {
    //   queueMicrotask(() => {
    //     this.resultArr = changes.finalArr?.currentValue;
    //     this.catchValue(this.resultArr);
    //   });
    // }
  }

  ngOnInit(): void {
    this.ctx.$scope.commonBarChartWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initSetting();
  }
  ngAfterViewInit() {
    this.echartInit();
  }

  echartInit() {
    if (this.barchart?.nativeElement) {
      this.renderer.setStyle(this.barchart.nativeElement, "width", "100%");
      this.renderer.setStyle(this.barchart.nativeElement, "height", "100%");
      echarts.init(this.barchart.nativeElement).dispose();
      this.myBarChart = echarts.init(this.barchart.nativeElement);
    }
  }

  initSetting() {
    this.gridSetting = isDefined(this.widgetConfig.settings.gridSetting)
      ? this.widgetConfig.settings.gridSetting.split(",")
      : ["70", "15%", "30", "30"];
    this.sortType = isDefined(this.widgetConfig.settings.sortType)
      ? this.widgetConfig.settings.sortType
      : "desc";
    this.chartTitle = isDefined(this.widgetConfig.settings.chartTitle)
      ? this.widgetConfig.settings.chartTitle
      : "";
    this.sortField = isDefined(this.widgetConfig.settings.sortField)
      ? this.widgetConfig.settings.sortField
      : "name";
    this.chartType = isDefined(this.widgetConfig.settings.chartType)
      ? this.widgetConfig.settings.chartType
      : "bar";
    this.describeOfChart = isDefined(this.widgetConfig.settings.describeOfChart)
      ? this.widgetConfig.settings.describeOfChart
      : "";
    this.chartAxisType = isDefined(this.widgetConfig.settings.chartAxisType)
      ? this.widgetConfig.settings.chartAxisType
      : "category";
    this.isFormatToArray = isDefined(this.widgetConfig.settings.isFormatToArray)
      ? this.widgetConfig.settings.isFormatToArray
      : false;
    this.rotate = isDefined(this.widgetConfig.settings.rotate)
      ? this.widgetConfig.settings.rotate
      : 0;
    this.isLegend = isDefined(this.widgetConfig.settings.isLegend)
      ? this.widgetConfig.settings.isLegend
      : true;
    // 设置大屏不同图表样式
    this.selectStyle = isDefined(this.widgetConfig.settings.selectStyle)
      ? this.widgetConfig.settings.selectStyle
      : "ljfengdian";
    this.color = this.colorMap.get(this.StyleOfchar);
    this.chartAxisLabelColor =
      this.selectStyle === "screenOfFd"
        ? "#FFFFFF"
        : this.chartAxisLabelColorMap.get(this.StyleOfchar);
    this.chartAxisLineColor =
      this.selectStyle === "screenOfFd"
        ? "#FFFFFF"
        : this.chartAxisLineColorMap.get(this.StyleOfchar);
    this.titleColor =
      this.selectStyle === "screenOfFd"
        ? "rgba(10, 153, 210, 1)"
        : this.titleColorMap.get(this.StyleOfchar);
    this.legendTextStyle =
      this.selectStyle === "screenOfFd"
        ? "#FFFFFF"
        : this.legendTextStyleMap.get(this.StyleOfchar);
  }
  flag = false;
  initData() {
    let valueTextObj = Object.keys(this.dimensionsSourceArr?.[0] ?? {});
    // 处理x轴的类型
    let interval = isDefined(this.widgetConfig.settings.interval)
      ? this.widgetConfig.settings.interval
      : "auto";

    let that = this;
    this.chartOption = {
      legend: {
        show: this.isLegend,
      },
      grid: {
        top: this.gridSetting[0],
        right: this.gridSetting[1],
        bottom: this.gridSetting[2],
        left: this.gridSetting[3],
      },
      color: this.color,
      dataset: [
        {
          source: this.dimensionsSourceArr,
        },
        {
          transform: {
            type: "sort",
            config: { dimension: this.sortField, order: this.sortType },
          },
        },
      ],
      xAxis: {
        name: this.describeOfChart,
        type: this.chartAxisType,
        axisLabel: {
          interval: interval === "auto" ? interval : Number(interval),
          color: this.chartAxisLabelColor,
          formatter: this.isFormatToArray ? `[{value}]` : "{value}",
          rotate: this.rotate,
        },
        axisLine: {
          lineStyle: {
            color: this.chartAxisLineColor,
          },
        },
      },
      yAxis: {
        type: "value",
        name: this.unitOfChart,
        nameTextStyle: {
          color: this.chartAxisLabelColor,
        },
        axisLabel: { color: this.chartAxisLabelColor },
      },
      series: {
        type: this.chartType,
        encode: { x: valueTextObj?.[0], y: valueTextObj?.[1] },
        datasetIndex: 1,
      },
      title: {
        text: this.chartTitle,
        textStyle: {
          color: this.titleColor,
        },
        left: this.selectStyle === "screenOfFd" ? "center" : '3%',
      },
      tooltip: {
        show: true,
        extraCssText: "z-index: 9999",
        formatter: function (params) {
          let str = "";
          if (that.chartAxisType === "time") {
            str = `${echarts.time.format(
              new Date(params.data.name),
              "{MM}-{dd} {hh}:{mm}:{ss}",
              false
            )}<br /> ${params.marker} ${params.data[valueTextObj?.[1]]} ${
              that.unitOfChart
            }`;
          } else {
            str = `${params.name} ${that.describeOfChart}<br /> ${
              params.marker
            } ${params.data[valueTextObj?.[1]]} ${that.unitOfChart}`;
          }
          return str;
        },
      },
    };
  }

  // 当数据源多余一条且没有传入资源列表的时候用这个逻辑
  initDataOnListBigger1AndNoSourceArr() {
    console.log("16772", this.StyleOfchar);
    let interval = isDefined(this.widgetConfig.settings.interval)
      ? this.widgetConfig.settings.interval
      : "auto";
    let legendList = [];
    let series = [];
    let unitMap = this.unitOfChart;
    this.ctx.data.forEach((i) => {
      legendList.push(i.dataKey.label);
      series.push({
        type: this.chartType,
        name: i.dataKey.label,
        data: i.data.map((j) => {
          return {
            name: j[0],
            value: j,
          };
        }),
      });
    });

    this.chartOption = {
      legend: {
        show: this.isLegend,
        data: legendList,
        textStyle: {
          color: this.legendTextStyle,
        },
      },
      grid: {
        top: this.gridSetting[0],
        right: this.gridSetting[1],
        bottom: this.gridSetting[2],
        left: this.gridSetting[3],
      },
      xAxis: {
        type: this.chartAxisType,
        axisLabel: {
          interval: interval === "auto" ? interval : Number(interval),
          color: this.chartAxisLabelColor,
        },
        axisLine: {
          lineStyle: {
            color: this.chartAxisLineColor,
          },
        },
      },
      yAxis: {
        type: "value",
        name: this.unitOfChart,
        nameTextStyle: {
          color: this.chartAxisLabelColor,
        },
        axisLabel: { color: this.chartAxisLabelColor },
      },
      series: series,
      title: {
        text: this.chartTitle,
        textStyle: {
          color: this.titleColor,
        },
      },
      tooltip: {
        show: true,
        extraCssText: "z-index: 9999",
        formatter: (params) => {
          let str = "";
          if (this.chartAxisType === "time") {
            str = `${echarts.time.format(
              new Date(params.value[0]),
              "{MM}-{dd} {hh}:{mm}:{ss}",
              false
            )}<br /> ${params.marker} ${Number(params.value[1]).toFixed(2)} ${
              unitMap[params.seriesName] ?? ""
            }`;
          } else {
            str = `${params.name} ${this.describeOfChart}<br /> ${
              params.marker
            } ${Number(params.value[1]).toFixed(2)} ${
              unitMap[params.seriesName] ?? ""
            }`;
          }
          return str;
        },
      },
    };
    // let that = this;
  }

  /*
    当数据源只有一条 且为动态数据需要实时动态效果的时候用这个逻辑 https://echarts.apache.org/examples/zh/editor.html?c=dynamic-data2
    传入数据格式应为：
    [
      {
        name: 时间戳,
        value: ["时间戳",value值]
      }
    ]
  */
  initDataOfRealTime() {
    console.log("执行了：", "initDataOfRealTime() func");
    this.chartOption = {
      legend: {
        show: this.isLegend,
      },
      grid: {
        top: this.gridSetting[0],
        right: this.gridSetting[1],
        bottom: this.gridSetting[2],
        left: this.gridSetting[3],
      },
      color: this.color,
      xAxis: {
        type: "time",
        axisLabel: { interval: "auto", color: this.chartAxisLabelColor },
        axisLine: {
          lineStyle: {
            color: this.chartAxisLineColor,
          },
        },
      },
      yAxis: {
        name: this.unitOfChart,
        nameTextStyle: {
          color: this.chartAxisLabelColor,
        },
        axisLabel: { color: this.chartAxisLabelColor },
      },
      series: {
        type: "line",
        encode: { x: "name", y: "value" },
        datasetIndex: 1,
        // @ts-ignore
        data: [...this.dimensionsSourceArr],
      },
      title: {
        text: this.chartTitle,
        textStyle: {
          color: this.titleColor,
        },
      },
      tooltip: {
        show: true,
        formatter: (params) => {
          let str = "";
          str = `${echarts.time.format(
            new Date(params.data.name),
            "{MM}-{dd} {hh}:{mm}:{ss}",
            false
          )}<br /> ${params.marker} ${params.data.value[1]} ${
            this.unitOfChart
          }`;
          return str;
        },
      },
    };
    // let that = this;
  }

  resizeChart() {
    if (this.myBarChart) {
      this.myBarChart.resize();
    }
  }

  public onDataUpdated() {
    //  this.initSetting()
    // @ts-ignore
    if (this.ctx.data.length > 1 && !this.dimensionsSourceArr) {
      this.initDataOnListBigger1AndNoSourceArr();
    } else {
      this.isRealTimeChart ? this.initDataOfRealTime() : this.initData();
    }

    if (this.myBarChart) {
      this.myBarChart.clear();
      this.myBarChart.setOption(this.chartOption);
    }
    this.ctx.detectChanges();
  }
}
