import { Component, OnInit, OnDestroy } from "@angular/core";
import { Input } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { NzMessageService } from "ng-zorro-antd/message";
import { AbnormalSoundMonitoringService } from "@app/core/http/abnormal-sound-monitoring.service";

interface abnormalTableData {
  // level: string;
  id: string;
  businessId: string;
  outerFlay: number;
  confidence: string;
  sim0: string;
  sim1: string;
  sim2: string;
  runFlag: string;
  voiceFlag0: string;
  voiceFlag1: string;
  voiceFlag2: string;
  voiceFlag3: string;
  periodFlag: string;
  version: string;
  timeStamp: string;
  createTime: string;
}
interface buttonData {
  name: string;
  id: string;
}

@Component({
  selector: "tb-historical-data",
  templateUrl: "./historical-data.component.html",
  styleUrls: ["./historical-data.component.scss"],
})
export class HistoricalDataComponent implements OnInit {
  @Input() ctx: WidgetContext;
  selectAllCheck: boolean = false;
  tableData: abnormalTableData[] = [];
  fullTableData: abnormalTableData[] = [];
  setSelectId = new Set<string>();
  searchTextOfName = "";
  fengjiData = {
    22222: "11号风机",
    3333: "11号风机",
  };
  clickButtonData: buttonData = { name: "11号风机", id: "22222" };
  selectData: abnormalTableData;
  buttonArr: buttonData[] = [];
  isVisible = false;

  constructor(
    private message: NzMessageService,
    private AbnormalSoundMonitoringService: AbnormalSoundMonitoringService
  ) {}
  ngOnInit() {
    this.tableData = [
      {
        id: "1",
        businessId: "string",
        outerFlay: 1,
        confidence: "7",
        sim0: "0.847",
        sim1: "0.847",
        sim2: "0.847",
        runFlag: "无异常",
        voiceFlag0: "连接状态",
        voiceFlag1: "string",
        voiceFlag2: "string",
        voiceFlag3: "string",
        periodFlag: "正在运行",
        version: "string",
        timeStamp: "string",
        createTime: "1649643724000",
      },
      {
        id: "2",
        businessId: "string",
        outerFlay: 1,
        confidence: "7",
        sim0: "0.847",
        sim1: "0.847",
        sim2: "0.847",
        runFlag: "无异常",
        voiceFlag0: "连接状态",
        voiceFlag1: "string",
        voiceFlag2: "string",
        voiceFlag3: "string",
        periodFlag: "正在运行",
        version: "string",
        timeStamp: "string",
        createTime: "1649643724000",
      },
      {
        id: "3",
        businessId: "string",
        outerFlay: 1,
        confidence: "7",
        sim0: "0.847",
        sim1: "0.847",
        sim2: "0.847",
        runFlag: "无异常",
        voiceFlag0: "连接状态",
        voiceFlag1: "string",
        voiceFlag2: "string",
        voiceFlag3: "string",
        periodFlag: "正在运行",
        version: "string",
        timeStamp: "string",
        createTime: "1649643724000",
      },
    ];

    return;
    this.AbnormalSoundMonitoringService.getFengji().subscribe(
      (res) => {
        console.log(res, "abnormal");
        this.fullTableData = res.data.content;
        this.tableData = this.fullTableData.filter(
          (item) => item.businessId === this.clickButtonData.id
        );
        let button = new Set();
        res.data.content.forEach((item) => {
          if (!button.has(item.businessId)) {
            this.buttonArr.push({
              name: this.fengjiData[item.businessId],
              id: item.businessId,
            });
          }
          button.add(item.businessId);
        });
      },
      (err) => {
        this.message.error(err);
      }
    );
  }
  buttonClick(clickButtonData: buttonData) {
    this.clickButtonData = clickButtonData;
    this.tableData = this.fullTableData.filter(
      (item) => item.businessId === this.clickButtonData.id
    );
  }
  handleTableDataDelete() {
    this.tableData = this.fullTableData.filter(
      (item) => !this.setSelectId.has(item.id)
    );
    this.fullTableData = this.tableData;
    this.message.success("已删除");
  }
  selectAll(check: boolean) {
    //全选以及全不选
    if (!check) {
      this.setSelectId.clear();
    } else {
      this.tableData.map((item) => {
        this.setSelectId.add(item.id);
      });
    }
  }
  handleSearch() {
    this.searchTextOfName = this.searchTextOfName.replace(/(^\s*)|(\s*$)/g, "");
    this.tableData = this.fullTableData.filter((item) => {
      return this.searchTextOfName.length > 0
        ? item.id.includes(this.searchTextOfName) ||
            item.confidence.includes(this.searchTextOfName) ||
            item.sim0.includes(this.searchTextOfName) ||
            item.sim1.includes(this.searchTextOfName) ||
            item.sim2.includes(this.searchTextOfName) ||
            item.runFlag.includes(this.searchTextOfName) ||
            item.createTime.includes(this.searchTextOfName) ||
            item.voiceFlag0.includes(this.searchTextOfName)
        : true;
    });
    this.setSelectId.clear();
    this.selectAllCheck = false;
  }
  selectSingle(data: abnormalTableData, id: string, check: boolean) {
    console.log("data", data);
    console.log("id", id);
    console.log("check", check);

    if (check) {
      this.setSelectId.add(id);
      this.selectData = data;
    } else {
      this.setSelectId.delete(id);
    }
    //判断是否全部选择
    if (this.setSelectId.size === this.tableData.length)
      this.selectAllCheck = true;
    else this.selectAllCheck = false;
  }
  cancel() {
    this.message.success("已取消");
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }
}
