import { Component, OnInit, OnDestroy } from "@angular/core";
import { Input } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";

@Component({
  selector: "tb-fd-abnormal-sound-monitoring",
  templateUrl: "./fd-abnormal-sound-monitoring.html",
  styleUrls: ["./fd-abnormal-sound-monitoring.scss"],
})
export class FdAbnormalSoundMonitoringComponent implements OnInit {
  @Input() ctx: WidgetContext;
  currentTime = new Date().getTime();
  // 进度条数据
  formatOne = (percent: number) => `${percent / 10}`;
  format1 = (percent: number) => `${percent / 100}`;
  format2 = (percent: number) => `${percent / 100}`;
  format3 = (percent: number) => `${percent / 100}`;
  // 选择器数据
  selectData = ["#12风机", "#13风机"];
  // 选择器默初始化认数据
  selectedProvince = this.selectData[0];
  // 卡片title
  cardTitle = "";
  // 卡片数据  这里为测试数据，有数据后删除重写
  cardData = {
    code: 0,
    msg: "成功",
    data: {
      content: [
        {
          id: 693,
          businessId: "22222",
          outerFlag: 1,
          confidence: "7",
          sim0: "0.347",
          sim1: "0.807",
          sim2: "0.231",
          runFlag: "1",
          voiceFlag0: "0",
          voiceFlag1: "0",
          voiceFlag2: "0",
          voiceFlag3: "0",
          periodFlag: "0",
          version: "22222",
          timeStamp: "2021-09-06 15:06:32",
          createTime: "2021-09-06 15:08:47",
        },
      ],
      pageable: {
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        offset: 0,
        pageSize: 10,
        pageNumber: 0,
        paged: true,
        unpaged: false,
      },
      totalPages: 51,
      totalElements: 507,
      last: false,
      number: 0,
      size: 10,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: 10,
      first: true,
      empty: false,
    },
  };
  constructor() {}
  ngOnInit() {
    this.cardTitle = this.selectData[0];
  }

  // 选择器选择事件 测试数据，有数据后删除重写
  provinceChange(value: string): void {
    this.cardTitle = value;
    if (value == "#12风机") {
      this.cardData.data.content[0] = {
        id: 693,
        businessId: "22222",
        outerFlag: 1,
        confidence: "7",
        sim0: "0.347",
        sim1: "0.807",
        sim2: "0.231",
        runFlag: "1",
        voiceFlag0: "0",
        voiceFlag1: "0",
        voiceFlag2: "0",
        voiceFlag3: "0",
        periodFlag: "0",
        version: "22222",
        timeStamp: "2021-09-06 15:06:32",
        createTime: "2021-09-06 15:08:47",
      };
    } else {
      this.cardData.data.content[0] = {
        id: 693,
        businessId: "22222",
        outerFlag: 0,
        confidence: "7",
        sim0: "0.847",
        sim1: "0.807",
        sim2: "0.831",
        runFlag: "0",
        voiceFlag0: "0",
        voiceFlag1: "0",
        voiceFlag2: "0",
        voiceFlag3: "0",
        periodFlag: "1",
        version: "22222",
        timeStamp: "2021-09-06 15:06:32",
        createTime: "2021-09-06 15:08:47",
      };
    }
  }

  // 类型转换方法
  expandNum(num: number | string, nultiple: number) {
    if (typeof num === "string") {
      num = Number(num);
    }
    return num * nultiple;
  }
  // 进度条警告
  isWarning(num) {
    return num > 0.6 ? "active" : "exception";
  }
}
