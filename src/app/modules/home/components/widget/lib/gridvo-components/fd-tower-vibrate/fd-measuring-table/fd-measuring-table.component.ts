import { Component, OnInit, Input } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { DataKey } from "@app/shared/models/widget.models";

@Component({
  selector: "tb-fd-measuring-table",
  templateUrl: "./fd-measuring-table.component.html",
  styleUrls: ["./fd-measuring-table.component.scss"],
})
export class FdMeasuringTableComponent implements OnInit {
  @Input() ctx: WidgetContext;

  thData = [];
  listOfData = [];

  constructor() {}

  ngOnInit(): void {
    this.ctx.$scope.FdMeasuringTable = this;
    this.setheadColumns();
  }

  // 设置头部列表
  setheadColumns() {
    this.thData =
      this.ctx.datasources[0]?.dataKeys?.filter(
        (i) => i.type === "timeseries"
      ) || [];
    this.thData.unshift({ label: "测点", name: "cd" });
  }

  // 设置列表数据
  setListData() {
    // 加try catch 是因为防止tb编辑器报错造成无法保存
    try {
      let obj = {};
      this.ctx.data.forEach((i) => {
        if (!obj[i.datasource.name]) {
          obj[i.datasource.name] = {};
        }
        if (!obj[i.datasource.name][i.dataKey.name]) {
          obj[i.datasource.name][i.dataKey.name] = 0;
        }
        obj[i.datasource.name][i.dataKey.name] = i.data[0][1];
      });
      let dataList = [];
      Object.entries(obj).forEach(([key, value]) => {
        const _value = value as any;
        dataList.push({
          ..._value,
          cd: `测点${_value.sensorPosition}`,
          sort: _value.sensorPosition,
        });
      });
      dataList.sort((a, b) => a.sort - b.sort);
      this.listOfData = dataList;
    } catch {
      this.listOfData = [];
    }
  }

  public onDataupdated() {
    this.setListData();
  }
}
