import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { getYear, getMonth } from "date-fns";

@Component({
  selector: "tb-fd-indicative-info",
  templateUrl: "./fd-indicative-info.component.html",
  styleUrls: ["./fd-indicative-info.component.scss"],
})
export class FdIndicativeInfoComponent implements OnInit {
  @Input() ctx: WidgetContext;

  public title: string;
  listOfData: any[]; // table 数据源
  // listByTime: object = {}; // 用时间分类的对象

  defaultRangeDate: Date[] = [];

  // private startTime: number; // 开始时间
  // private endTime: number; // 结束时间
  // headList: DataKey[] = []; // 头部列表
  extraProperty: any[] = []; // 额外的属性
  block = [];
  constructor(private cd: ChangeDetectorRef) {
    const date = new Date();
    this.defaultRangeDate = [
      new Date(getYear(date), getMonth(date), 1),
      new Date(getYear(date), getMonth(date) + 1, 0),
    ];
  }

  ngOnInit(): void {
    console.log("当前ctx", this.ctx);
    this.title = this.ctx.widgetConfig.settings.title;
    this.ctx.$scope.gfMonthReport = this;
    this.handleChangeCb(); // 一开始进入时用默认时间
    // this.initHeadList();
    this.onDataUpdated();
    this.block = this.ctx.widgetConfig.settings.block;
  }

  public onDataUpdated() {
    let blockData = [];
    this.ctx?.data.forEach((item) => {
      blockData.push(item?.data?.[0]?.[1]);
    });
    blockData = blockData.map((item, index) => {
      item = {
        data: (+item).toFixed(2),
        name: this.block[index]?.name,
        company: this.block[index]?.company,
      };
      return item;
    });

    this.block = blockData;
    // 用时间做分类
    // console.log(this.ctx);

    // this.listByTime = {};
    // this.ctx.data.forEach((i: DatasourceData) => {
    //   const { data, dataKey, datasource } = i;

    //   if (data.length) {
    //     data.forEach((j) => {
    //       const timeString: string = moment(j[0]).format("YYYY-MM-DD");
    //       if (!this.listByTime[timeString]) {
    //         this.listByTime[timeString] = {
    //           time: timeString,
    //           timeStamp: new Date(timeString).getTime(),
    //           key: timeString,
    //         };
    //         // 列表头有两个数据不是从订阅的数据里来的，所以分成一个extraProperty来做特殊处理
    //         this.extraProperty.forEach((exProp) => {
    //           if (exProp.name === "time") {
    //             this.listByTime[timeString].time = {
    //               label: exProp.label,
    //               name: exProp.name,
    //               value: timeString,
    //             };
    //           } else {
    //             this.listByTime[timeString][exProp.name] = {
    //               label: exProp.label,
    //               name: exProp.name,
    //               value: exProp.value,
    //             };
    //           }
    //         });
    //         // extraProperty 刚好都是放在前面的，所以处理完后再处理订阅的数据
    //         datasource.dataKeys.forEach((sourceKeyItem) => {
    //           this.listByTime[timeString][sourceKeyItem.name] = {
    //             label: sourceKeyItem.label,
    //             name: sourceKeyItem.name,
    //             value: 0,
    //           };
    //         });
    //       }
    //       this.listByTime[timeString][dataKey.name].label = dataKey.label;
    //       this.listByTime[timeString][dataKey.name].name = dataKey.name;
    //       this.listByTime[timeString][dataKey.name].value = j[1];
    //     });
    //   }
    // });

    // this.listOfData = Object.values(this.listByTime).sort((a, b) => {
    //   return a.timeStamp - b.timeStamp;
    // });
    // console.log(`this.listOfData`, this.listOfData);
    this.ctx.detectChanges();
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  // initExtraProperty() {
  //   this.extraProperty = [
  //     {
  //       label: "风场名称",
  //       name: this.ctx.datasources[0].entity.name,
  //       value: this.ctx.datasources[0].entity.name,
  //     },
  //   ];
  // }

  // initHeadList() {
  //   this.initExtraProperty();
  //   this.extraProperty.forEach((i) => {
  //     this.headList.push(i);
  //   });
  //   this.ctx.datasources[0].dataKeys.forEach((i) => {
  //     this.headList.push(i);
  //   });
  // }

  public handleChangeCb(rangeDate?: Date[]) {
    if (rangeDate) {
      // 仪表板时间切换
      const startTime = new Date(
        rangeDate[0].getFullYear(),
        rangeDate[0].getMonth(),
        1
      ).getTime();
      const endTime =
        new Date(
          rangeDate[1].getFullYear(),
          rangeDate[1].getMonth() + 1,
          0
        ).getTime() +
        (23 * 60 * 60 + 59 * 60 + 59) * 1000;
      this.ctx.timewindowFunctions.onUpdateTimewindow(startTime, endTime);
    } else {
      this.ctx.timewindowFunctions.onUpdateTimewindow(
        this.defaultRangeDate[0].getTime(),
        this.defaultRangeDate[1].getTime()
      );
    }
  }
}
