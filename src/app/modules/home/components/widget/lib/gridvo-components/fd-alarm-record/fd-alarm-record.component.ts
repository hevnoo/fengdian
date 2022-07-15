import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { deepClone } from '@app/core/utils';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import moment from 'moment';
import { AlarmService } from '@core/http/alarm.service';
import { AlarmDataPageLink, Direction, EntityDataSortOrder, EntityKey, EntityKeyType } from '@app/shared/models/query/query.models';
import { AlarmSearchStatus, AlarmSeverity } from '@app/shared/public-api';
import { TimeRange } from './fd-alarm-time-picker/fd-alarm-time-picker.component'
import { NzModalService } from 'ng-zorro-antd/modal';

export interface selectOption {
  value: any,
  label: string
}
export interface IPage {
  page: number,
  pageSize: number
  total: number
}

@Component({
  selector: 'tb-fd-alarm-record',
  templateUrl: './fd-alarm-record.component.html',
  styleUrls: ['./fd-alarm-record.component.scss']
})
export class FdAlarmRecordComponent implements OnInit, AfterViewInit {
  @Input() ctx: WidgetContext
  @ViewChild("alarmTimePicker") alarmTimePicker: ElementRef

  constructor(
    private alarmService: AlarmService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService
  ) { }

  alarmTypeList: Array<string> = []
  alarmTypeListValue: Array<string> = []
  severityEn2CnMap = new Map<string, string>()
    .set("CRITICAL", "一级")
    .set("MAJOR", "二级")
    .set("MINOR", "三级")
    .set("WARNING", "四级")

  statusEn2CnMap = new Map<string, string>()
    // .set("ACTIVE", "已激活")
    // .set("CLEARED", "已清除")
    // .set("ACK", "已应答")
    // .set("UNACK", "未应答")
    .set("ACTIVE_UNACK", "激活未应答")
    .set("ACTIVE_ACK", "激活已应答")
    .set("CLEARED_UNACK", "清除未应答")
    .set("CLEARED_ACK", "清除已应答")

  // 告警等级键值对
  severityMap: Map<string, string> = new Map<string, string>()
    .set("CRITICAL", "一级")
    .set("MAJOR", "二级")
    .set("MINOR", "三级")
    .set("WARNING", "四级")
  severityOptionList: Array<selectOption> = ((): Array<selectOption> => {
    let arr = []
    this.severityMap.forEach((key, value) => {
      arr.push({ value: value, label: key })
    })
    return arr
  })()
  severityValue: Array<string> = []
  severityCheckedList: Array<AlarmSeverity> = []
  statusCheckedList: Array<AlarmSearchStatus> = []
  dateRangeData: Array<number> = []

  originTableData = []
  tableData = []
  theadItem = []
  pagination: IPage = {
    page: 1,
    pageSize: 10,
    total: 0
  }

  sliderSwitchText: string[] = ["最新告警", "历史告警"] // 切换实时告警跟历史告警
  sliderStatus: string = "实时告警"
  searchText: string = ""

  isVisible: boolean = false
  modalData: any = {}

  // table栏的告警状态
  tableStatusMap: Map<string, string> = new Map<string, string>()
    .set("ACTIVE_UNACK", "激活未应答")
    .set("ACTIVE_ACK", "激活已应答")
    .set("CLEARED_UNACK", "清除未应答")
    .set("CLEARED_ACK", "清除已应答")

  ngOnInit(): void {
    this.ctx.$scope.FdAlarmRecordComponent = this
    this.alarmTypeList = this.ctx.widgetConfig.alarmTypeList
    this.theadItem = deepClone(this.ctx.defaultSubscription.alarmSource.dataKeys)
  }

  ngAfterViewInit(): void {
    this._subscribeForPage()
  }

  public onDataUpdated() {
    this.setValueOnDataUpdate()
    this.ctx.detectChanges();
  }

  // 私有订阅方法，不用每次都传入this.searchText
  private _subscribeForPage(): void {
    this.subscribeForPage(this.searchText)
  }

  // 订阅pagination数据
  public subscribeForPage(searchText: string) {
    this.searchText = searchText || ""
    let pageLink: AlarmDataPageLink
    const sort: EntityDataSortOrder = {
      key: { type: EntityKeyType.ALARM_FIELD, key: "createdTime" } as EntityKey,
      direction: Direction.DESC
    }
    pageLink = {
      page: this.pagination.page - 1, //当前页
      pageSize: this.pagination.pageSize, //每页显示多少
      dynamic: true,
      severityList: this.severityCheckedList,
      statusList: this.statusCheckedList,
      searchPropagatedAlarms: this.ctx.widgetConfig.searchPropagatedAlarms,
      sortOrder: sort,
      textSearch: searchText,
      typeList: this.alarmTypeListValue
    };
    console.log('pageLink', pageLink)
    this.ctx.defaultSubscription.subscribeForAlarms(pageLink, null)
  }

  // 搜索
  handleSearch() {
    this.severityCheckedList = []
    for (let [key, value] of Object.entries(AlarmSeverity)) {
      if (this.severityValue.includes(value)) {
        this.severityCheckedList.push(AlarmSeverity[key])
      }
    }

    this.statusCheckedList = []
    const set = new Set<string>()
    this.alarmTypeListValue.forEach(i => {
      set.add(i)
    })
    const status: string[] = []
    set.forEach(i => {
      status.push(i)
    })
    for (let [key, value] of Object.entries(AlarmSearchStatus)) {
      if (status.includes(value)) {
        this.statusCheckedList.push(AlarmSearchStatus[key])
      }
    }
    this._subscribeForPage()
  }

  // 表格的宽度
  tableItemWidth(name: string) {
    switch (name) {
      case "severity": return "100px";
      case "originator": return "150px";
      default: return "auto";
    }
  }

  // table显示数据
  tbodyValue(data: any, key: string): any {
    let value = data[key]

    // 如果是'detail.count' 这样形式传进来的时候做key值的处理
    if (key.indexOf(".") > -1) {
      const keyArr = key.split(".")
      for (let i = 0; i < keyArr.length; i++) {
        if (i === 0) {
          value = data[keyArr[i]]
        } else {
          value = value && value[keyArr[i]] || ""
        }
      }
    }
    if (key === "createdTime") {
      return moment(value).format("YYYY-MM-DD HH:mm:ss")
    }
    if (key === "severity") {
      return this.severityMap.get(value)
    }
    if (key === "originator") {
      return data["originatorName"]
    }
    if (key === "status") {
      return this.tableStatusMap.get(value)
    }
    return value
  }

  // 显示确认按钮
  hideConfirmButton(item): boolean {
    let bool: boolean = false
    const state: string = item.status.split("_")[1]
    bool = state === "ACK"
    return bool
  }


  // 显示清除按钮
  hideClearButton(item): boolean {
    let bool: boolean = false
    const state: string = item.status.split("_")[0]
    bool = state === "CLEARED"
    return bool
  }

  // 返回modalData
  setModalData(item) {
    this.modalData = {
      ...item,
      _createdTime: new Date(item.createdTime),
      _severity: this.severityEn2CnMap.get(item.severity),
      _status: this.statusEn2CnMap.get(item.status),
      // _details: JSON.stringify(item.details)
      _details: item.details.data
    }
  }

  // 告警确认
  handleConfirm($event, data?): void {
    if (data) {
      this.setModalData(data)
    }
    this.ackAlarm(this.modalData)
  }

  // 确认告警
  ackAlarm(alarm): void {
    this.modal.confirm({
      nzTitle: `告警确认`,
      nzContent: `确定要确认告警吗？`,
      nzOnOk: () => {
        this.alarmService.ackAlarm(alarm.id.id).subscribe(() => {
          this.getAlarmInfo(alarm.id.id)
        });
      }
    })
  }

  // 清除告警
  clearAlarm(alarm): void {
    this.modal.confirm({
      nzTitle: `清除警报`,
      nzContent: `确定要清除警报吗？`,
      nzOnOk: () => {
        this.alarmService.clearAlarm(alarm.id.id).subscribe(() => {
          this.getAlarmInfo(alarm.id.id)
        });
      }
    })
  }

  // get alarm info by id
  getAlarmInfo(alarmId) {
    this.alarmService.getAlarmInfo(alarmId).subscribe((res) => {
      this.setModalData(res)
      this.ctx.defaultSubscription.update();
    })
  }

  // 显示详情弹窗
  showDetail($event, item): void {
    this.setModalData(item)
    this.isVisible = true
  }

  // 清除告警
  handleClear($event, data?): void {
    if (data) {
      this.setModalData(data)
    }
    this.clearAlarm(this.modalData)
  }

  // 数据更新时要设置的东西
  setValueOnDataUpdate() {
    // 如果数据超过pagesize就自己做分页
    if (this.ctx.defaultSubscription.alarms.data.length > this.pagination.pageSize) {
      const total = this.ctx.defaultSubscription.alarms.totalElements
      const size = this.pagination.pageSize
      const arrLength = Math.ceil(total / size)
      for (let i = 0; i < arrLength; i++) {
        if (i < arrLength - 1) {
          this.originTableData[i] = new Array(size).fill(0).map((_, index) => {
            return this.ctx.defaultSubscription.alarms.data[i * size + index]
          })
        } else {
          this.originTableData[i] = new Array(total % size).fill(0).map((_, index) => {
            return this.ctx.defaultSubscription.alarms.data[i * size + index]
          })
        }
      }
      this.tableData = this.originTableData[this.pagination.page - 1]
      this.pagination.total = this.ctx.defaultSubscription.alarms.totalElements
      this.pagination.pageSize = this.ctx.settings.defaultPageSize || 10
    } else {
      // 返回数据是已经做好分页的
      this.tableData = this.ctx.defaultSubscription.alarms.data
      this.pagination.total = this.ctx.defaultSubscription.alarms.totalElements
      this.pagination.pageSize = this.ctx.settings.defaultPageSize || 10
    }
  }

  // slider 切换  
  handleSliderSwitch(item: string): void {
    this.sliderStatus = item
    if (!this.dateRangeData[0]) {
      this.dateRangeData[0] = this.ctx.timeWindow.minTime
      this.dateRangeData[1] = this.ctx.timeWindow.maxTime
      // @ts-ignore: Unreachable code error
      this.alarmTimePicker.setDateRangePicker({ startTime: this.ctx.timeWindow.minTime, endTime: this.ctx.timeWindow.maxTime })
    }
    this.onSliderChange()
  }

  // 实时告警，历史告警切换回调
  onSliderChange() {
    switch (this.sliderStatus) {
      case "最新告警":
        this.ctx.timewindowFunctions.onResetTimewindow()
        break;
      case "历史告警":
        this.ctx.timewindowFunctions.onUpdateTimewindow(this.dateRangeData[0], this.dateRangeData[1])
        break;
    }
  }

  // 时间改变
  timeChange(timeRange: TimeRange) {
    this.dateRangeData = [timeRange.startTime, timeRange.endTime]
    this.ctx.timewindowFunctions.onUpdateTimewindow(this.dateRangeData[0], this.dateRangeData[1])
  }

  // 清除按钮禁用状态
  clearDisabled(): boolean {
    let bool: boolean = false
    const state: string = this.modalData.status.split("_")[0]
    bool = state === "CLEARED"
    return bool
  }

  // 确认按钮禁用状态
  confirmDisabled(): boolean {
    let bool: boolean = false
    const state: string = this.modalData.status.split("_")[1]
    bool = state === "ACK"
    return bool
  }

  // 页码改变
  pageIndexChange($event: number): void {
    this.pagination.page = $event
    this._subscribeForPage()
  }

  // 显示数量改变       
  pageSizeChange($event: number): void {
    this.pagination.pageSize = $event || 10
    this._subscribeForPage()
  }

  close() {
    this.isVisible = false
  }

}
