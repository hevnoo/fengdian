import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  Input,
} from "@angular/core";
import * as echarts from "echarts";
import { isDefined } from "@core/utils";
import { WidgetConfig } from "@shared/models/widget.models";
import { WidgetContext } from "@home/models/widget-component.models";
import { EChartsOption, RadarSeriesOption } from "echarts";
import { ThemeService } from "@app/core/services/theme.server";
@Component({
  selector: "fd-radar-chart",
  templateUrl: "./radar-chart.component.html",
  styleUrls: ["./radar-chart.component.scss"],
})
export class RadarChartComponent implements OnInit {
  public widgetConfig: WidgetConfig;
  @ViewChild("radarchart") radarchart: ElementRef;
  @Input() ctx: WidgetContext;
  echartsInstance = null;
  data: any[] = []; // 图例数据
  name = [
    "N",
    "北北西",
    "西北",
    "西西北",
    "W",
    "西西南",
    "西南",
    "南南西",
    "S",
    "南南东",
    "东南",
    "东东南",
    "E",
    "东东北",
    "东北",
    "北北东",
  ];
  chartOption: EChartsOption;
  myChart;
  constructor(private themeService: ThemeService) {}
  ngAfterViewInit() {
    this.echartInit();
  }

  echartInit() {
    if (this.radarchart?.nativeElement) {
      echarts.init(this.radarchart.nativeElement).dispose();
      this.myChart = echarts.init(this.radarchart.nativeElement);
      this.myChart.setOption(this.chartOption);
    }
  }

  ngOnInit(): void {
    // console.log(this.themeService, 'theme', this.ctx)
    this.ctx.$scope.radarChartWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initData();
    // this.myChart = echarts.init($('#radar-chart')[0]);
    // this.setOptions()
  }

  initData() {
    this.chartOption = {
      title: {
        text: "风玫瑰图",
        textStyle: {
          color: "#000",
        },
      },
      tooltip: {
        show: true,
        confine: true,
        textStyle: {
          color: "#fff",
        },
        backgroundColor: "rgba(0,0,0,0.7)",
        formatter: (e) => {
          let value = e.data.value;
          let str = `<span>风速玫瑰</span><br/>`;
          // let name = ['N', '北北西', '西北', '西西北', 'W', '西西南', '西南', '南南西', 'S', '南南东', '东南', '东东南', 'E', '东东北', '东北', '北北东',
          // ]
          value.forEach((item, index) => {
            if (index < this.name.length) {
              str += `<span>${this.name[index]}:${item}</span><br/>`;
            }
          });
          return str;
        },
        // position: function (pos, params, el, elRect, size) {
        //     var obj = { top: 10 };
        //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        //     return obj;
        // },
      },
      legend: {
        data: ["风速玫瑰图"],
        show: false, //不显示图例,
      },
      radar: {
        shape: "circle",
        axisName: {
          color: "rgba(176,58,91,1)", //标签的样式
        },
        radius: "70%",
        center: ["50%", "54%"],
        splitLine: {
          lineStyle: {
            color: [
              "rgba(0,156,220, 0.1)",
              "rgba(0,156,220, 0.2)",
              "rgba(0,156,220, 0.4)",
              "rgba(0,156,220, 0.6)",
              "rgba(0,156,220, 0.8)",
              "rgba(0,156,220, 1)",
            ].reverse(),
            type: "dashed", //虚线
          }, //每层圆圈的样式
        },
        splitArea: {
          show: false, //不显示划分每个区域的样式
        },
        indicator: [
          { name: "N(1)", max: 15 },
          { name: "16", max: 15 },
          { name: "15", max: 15 },
          { name: "14", max: 15 },
          { name: "W(13)", max: 15 },
          { name: "12", max: 15 },
          { name: "11", max: 15 },
          { name: "10", max: 15 },
          { name: "S(9)", max: 15 },
          { name: "8", max: 15 },
          { name: "7", max: 15 },
          { name: "6", max: 15 },
          { name: "E(5)", max: 15 },
          { name: "4", max: 15 },
          { name: "3", max: 15 },
          { name: "2", max: 15 },
        ],
        // center: ['50%', '56%'], //玫瑰图相对于容器的宽高
        axisLine: {
          lineStyle: {
            color: "rgba(0,156,220, 0.5)", //由圆点往外的线的样式
            type: "dashed", //虚线
          },
        },
      },
      series: [
        {
          name: "totalChart",
          type: "radar",
          data: [
            {
              // value: [5000, 4500, 20000, 3000, 40089, 21000, 5000, 14000, 28000, 26000, 42000, 21000],
              value: this.data,
              name: "风速玫瑰图",
            },
          ],
          itemStyle: {
            color: "rgb(176,58,91)", //线的样式
          },
          areaStyle: {
            color: "rgba(176,58,91,0.6)",
          },
          lineStyle: {
            //线的长度
            width: 1,
            // opacity: 0.5
          },
          symbol: "none", //让拐点消失
        },
      ],
    };
  }

  dataChange() {
    // 遍历时间线数据
    // console.log(this.ctx.data);
    this.data = [];
    this.ctx.data.map((item: any) => {
      // 判断数据长度，无数据填充0
      if (item.data.length > 0) {
        this.data.push(item.data[item.data.length - 1][1] ?? 0);
      } else {
        this.data.push(0);
      }
    });
    // console.log("data", this.data);
  }

  public setOptions() {
    this.dataChange();
    this.chartOption.series[0].data[0].value = this.data;
    // console.log(this.ctx, '111', this.data, this.chartOption.radar["axisName"].color, this.themeService.getActiveTheme().properties["--blue-border-1"])
    //主题定制，下方目前是随便写的--blue-1，下次有新的样式的时候将它加入到theme.ts文件里面，在这里修改成对应变量即可完成主题定制
    if (this.themeService.getActiveTheme()) {
      let theme = this.themeService.getActiveTheme();
      this.chartOption.radar["axisName"].color =
        theme.properties["--pinkRed-1"]; //标签颜色
      this.chartOption.tooltip["textStyle"].color =
        theme.properties["--white-1"]; //提示框文字的颜色
      this.chartOption.tooltip["backgroundColor"] =
        theme.properties["--dark-seven"]; //提示框背景颜色
      this.chartOption.radar["splitLine"].lineStyle.color = []
        .concat(
          theme.properties["--moreBlue"].replace(/[)][,]/g, ")@").split("@")
        )
        .reverse(); //圈圈的颜色,这里的@只是用来把他们分开，没有用到最后的数组中
      // console.log( this.chartOption.radar["splitLine"].lineStyle.color,"color")
      this.chartOption.radar["axisLine"].lineStyle.color =
        theme.properties["--blue-five"]; //由圆心向外的线的颜色
      this.chartOption.series[0]["itemStyle"].color =
        theme.properties["--pinkRed-1"]; //区域的线的颜色
      this.chartOption.series[0]["areaStyle"].color =
        theme.properties["--pinkRed-six"]; //区域的颜色
    }
    this.myChart.setOption(this.chartOption);
    this.myChart.resize({
      width: this.ctx.width,
      height: this.ctx.height,
    });
  }
}
