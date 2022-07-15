import { Component, OnInit, Input } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import * as echarts from "echarts";
import { EChartsOption } from "echarts";

@Component({
  selector: "tb-fd-swing-track-chart",
  templateUrl: "./fd-swing-track-chart.component.html",
  styleUrls: ["./fd-swing-track-chart.component.scss"],
})
export class FdSwingTrackChartComponent implements OnInit {
  @Input() ctx: WidgetContext;

  outsideCircle: number[][] = []; // 外圆
  insideCircle: number[][] = []; // 内圆
  maxRadiusAxis: number = 300;
  cxOffset: number = 0;
  cyOffset: number = 0;
  echartsInstance: echarts.ECharts = null;
  chartOption: EChartsOption = {
    title: {
      text: "顶部测点摆动轨迹",
      // subtext: '塔筒轨迹随时间变化',
      left: "center",
    },
    polar: {
      center: ["50%", "60%"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    angleAxis: {
      type: "value",
      startAngle: 0,
      min: 0,
      max: 360,
    },
    radiusAxis: {
      max: this.maxRadiusAxis,
      min: 0,
    },
    series: [
      {
        // 外圆
        coordinateSystem: "polar",
        tooltip: {
          show: false,
        },
        name: "line",
        type: "line",
        data: this.outsideCircle,
        showSymbol: false,
      },
      {
        // 内圆
        coordinateSystem: "polar",
        tooltip: {
          show: false,
        },
        name: "polar",
        type: "custom",
        data: this.insideCircle,
        renderItem: (params, api) => {
          // console.log('this.ctx.data :>> ', this.ctx.data);
          // console.log('this.cxOffset', this.cxOffset)
          // console.log('this.cyOffset', this.cyOffset)
          // console.log('params', params)
          // // @ts-expect-error
          // const cx = params.coordSys.cx + params.coordSys.r / this.maxRadiusAxis * this.cxOffset
          // // @ts-expect-error
          // const cy = params.coordSys.cy + params.coordSys.r / this.maxRadiusAxis * this.cyOffset
          // console.log('cx', cx)
          // console.log('cy', cy)

          return {
            type: "arc",
            shape: {
              cx:
                params.coordSys["cx"] +
                (params.coordSys["r"] / this.maxRadiusAxis) * this.cxOffset,
              cy:
                params.coordSys["cy"] +
                (params.coordSys["r"] / this.maxRadiusAxis) * this.cyOffset,
              r: (params.coordSys["r"] / this.maxRadiusAxis) * 180,
            },
            style: {
              stroke: "#3178c6",
              fill: "transparent",
              lineWidth: 1,
              lineDash: [5],
            },
          };
        },
      },
    ],
  };
  constructor() {}

  // 设置内圆的偏移量
  setOffsetPosition() {
    const offItem = this.ctx.data.find((i) => i.dataKey.name === "off"); // 拿到偏移量数据
    const dirItem = this.ctx.data.find((i) => i.dataKey.name === "dir"); // 拿到方向数据 单位角度 0到180， 0到-180
    const dirData = dirItem?.data[0][1];
    let dirAngle = 0;
    if (dirData > 0) {
      dirAngle = 360 - dirData;
      // dirAngle = 360 + dirData
    } else {
      dirAngle = Math.abs(dirData);
      // dirAngle = -Math.abs(dirData)
    }

    this.cxOffset = Math.cos(dirAngle) * offItem?.data[0][1] || 0; // 计算x的偏移位置
    this.cyOffset = -Math.sin(dirAngle) * offItem?.data[0][1] || 0; // 计算y的偏移位置, y轴会相反所以加个负号
    // this.cyOffset = Math.sin(dirAngle) * offItem.data[0][1]
  }

  ngOnInit(): void {
    this.ctx.$scope.FdSwingTrackChart = this;
    this.setCircleData();
    this.setOffsetPosition();
  }

  // 外部调用，数据更新时触发
  public onDataUpdated() {
    if (this.echartsInstance) {
      this.setOffsetPosition();
      this.setOptions();
    }
  }

  // 设置echarts配置项
  public setOptions() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.chartOption);
      this.ctx.detectChanges();
    }
  }

  // 设置风机的内外圆数据
  setCircleData() {
    for (let i = 0; i <= 360; i++) {
      // 绘制风机底部的大圆
      let outsidePoint = [];
      outsidePoint.push(230);
      outsidePoint.push(i);
      this.outsideCircle.push(outsidePoint);

      // 绘制风机的告警圆
      let insidePoint = [];
      insidePoint.push(180);
      insidePoint.push(i);
      this.insideCircle.push(insidePoint);
    }
  }

  // resize chart
  public resize() {
    if (this.echartsInstance) {
      console.log("resize");
      this.echartsInstance.resize();
    }
  }

  // echarts初始化
  onChartInit(ec: echarts.ECharts): void {
    this.echartsInstance = ec;
  }
}
