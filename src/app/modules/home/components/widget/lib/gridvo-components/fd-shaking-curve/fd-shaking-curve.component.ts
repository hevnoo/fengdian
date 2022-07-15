import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { EChartsOption } from 'echarts';
import { FdShakingChartComponent } from './fd-shaking-chart/fd-shaking-chart.component'
import { FileManagementService } from '@app/core/http/file-management.service'
import moment from 'moment'
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from "@angular/common/http";

interface SelectOption {
  label: string,
  value: any,
  sort?: number,
  origin?: any
}
@Component({
  selector: 'tb-fd-shaking-curve',
  templateUrl: './fd-shaking-curve.component.html',
  styleUrls: ['./fd-shaking-curve.component.scss']
})
export class FdShakingCurveComponent implements OnInit {
  @Input() ctx: WidgetContext
  @ViewChild("shakingChart") shakingChartRef: FdShakingChartComponent
  windMachineOptions: Array<SelectOption> = []
  windMachineValue: any

  dateValue: Date = new Date();

  channelValue: any
  channelOptions: Array<SelectOption> = [
    {
      label: "主轴承_前_水平",
      value: "主轴承_前_水平"
    },
    {
      label: "主轴承_后_水平",
      value: "主轴承_后_水平"
    },
    {
      label: "齿轮箱_一级行星_水平",
      value: "齿轮箱_一级行星_水平"
    },
    {
      label: "齿轮箱_低速轴_径向",
      value: "齿轮箱_低速轴_径向"
    },
    {
      label: "齿轮箱_高速轴_径向",
      value: "齿轮箱_高速轴_径向"
    },
    {
      label: "齿轮箱_高速轴_轴向",
      value: "齿轮箱_高速轴_轴向"
    },
    {
      label: "发电机_驱动端_径向",
      value: "发电机_驱动端_径向"
    },
    {
      label: "发电机_自由端_径向",
      value: "发电机_自由端_径向"
    }
  ]

  fileListValue: any
  fileListOptions: Array<SelectOption> = []

  chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    title: {
      left: 'center',
      text: '振动曲线'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: {
            zoom: "区域缩放",
            back: "缩放还原"
          }
        },
        // restore: {
        //   title: "还原"
        // },
        saveAsImage: {
          title: "保存"
        }
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10
      },
      {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: '振幅',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: [] // data
      }
    ]
  }

  searchLoading: boolean = false

  constructor(
    private fileManagementService: FileManagementService, 
    private http: HttpClient,
    private msg: NzMessageService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.initWindMachineOptions()
    this.initChannelValue()
    this.getFileList()
  }

  initChannelValue() {
    this.channelValue = this.channelOptions[0].value
  }

  initWindMachineOptions() {
    let arr = []
    this.ctx.datasources.forEach(i => {
      const label = i.entityLabel.split("/").pop()
      const no = i.name.slice(2) // 结果会是"001"
      if (i.aliasName === "设备-仪表板实体状态") {
        this.windMachineValue = no
      } else {
        arr.push({
          label: label,
          value: no,
          sort: Number(no)
        })
      }
    })
    arr.sort((a, b) => a.sort - b.sort)
    this.windMachineOptions = arr
  }

  // 获得文件列表
  getFileList() {
    let fetchValue = {
      kw: this.windMachineValue + "_" + this.channelValue,
      dir: "/shaking/" + moment(this.dateValue).format("YYYYMMDD")
    }
    this.fileManagementService.searchFiles(fetchValue).subscribe(res => {
      this.fileListOptions = res.map(i => {
        return { label: i.name, value: i.md5, ...i }
      })
    })
  }

  // 重置文件列表选中值
  resetFileListValue() {
    this.fileListValue = ""
  }

  // 风机选择改变
  windMachineChange(value: any) {
    this.resetFileListValue()
    this.getFileList()
  }

  // 日期改变
  datePickerChange(date: Date) {
    this.resetFileListValue()
    this.getFileList()
  }

  // 通道改变 
  channelChange(value: any) {
    this.resetFileListValue()
    this.getFileList()
  }

  // search 
  search() {
    if (!this.fileListValue) { return this.msg.error("请选择文件") }
    this.searchLoading = true
    this.fetchFile().then(res => {
      const { response, fileName } = res
      let _fileName = fileName.replace(/\.[\s\S]*/, "") // 去除副档名
      const [place, machineNo, widgetName, position, direction, frequency, shankingType, speed, date] = _fileName.split("_")
      const arr = (response as string).split(" ")
      const year = date.slice(0, 4)
      const month = date.slice(4, 6)
      const day = date.slice(6, 8)
      const hour = date.slice(8, 10)
      const minute = date.slice(10, 12)
      const second = date.slice(12, 14)
      let _time = new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}`).getTime()
      let _frequency = Number(frequency) // 单位ms
      this.chartOption.series[0].data = arr.map((i, index) => {
        return [_time + _frequency * index, i]
      })
      this.updateChart()
      this.searchLoading = false
      this.cd.detectChanges()
    }).catch(err => {
      this.searchLoading = false
      console.log('err', err)
      this.msg.error(err.msg)
      this.cd.detectChanges()
    })
  }

  // 请求文件
  async fetchFile(): Promise<any> {
    const { name, path } = (this.fileListOptions.find((i: any) => i.md5 === this.fileListValue) as any)
    let origin = process.env.NODE_ENV === "development" ? "http://10.0.5.92:30661" : location.origin
    let fetchUrl = `${origin}/group1/${path}/${name}`
    const res = await this.http.get(fetchUrl, { responseType: "text" }).toPromise()
    return { response: res, fileName: name }
  }

  updateChart() {
    this.shakingChartRef.onDataUpdated()
    this.ctx.detectChanges()
  }
}
