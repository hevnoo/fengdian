import { Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { IDataList } from '@home/components/widget/lib/gridvo-components/common-components/group-select-block/group-select-block.component'
import { GroupSelectBlockComponent } from '@home/components/widget/lib/gridvo-components/common-components/group-select-block/group-select-block.component'
import { GridvoUtilsService } from '@app/core/services/gridvo-utils.service'
import moment from 'moment'

export interface TimeRange {
  startTime: number,
  endTime: number,
}

@Component({
  selector: 'tb-fd-alarm-time-picker',
  templateUrl: './fd-alarm-time-picker.component.html',
  styleUrls: ['./fd-alarm-time-picker.component.scss']
})
export class FdAlarmTimePickerComponent implements OnInit {
  @Input() ctx: WidgetContext
  @Output() timeChange = new EventEmitter()

  @ViewChild("groupSelectBlock") groupSelectBlock: GroupSelectBlockComponent | ElementRef

  constructor(
    private utils: GridvoUtilsService,
    private cd: ChangeDetectorRef,
  ) { }

  selectBlockData: Array<IDataList> = [
    {
      label: "今天",
      value: "today"
    },
    {
      label: "本周",
      value: "thisWeek"
    },
    {
      label: "本月",
      value: "thisMonth"
    },
    {
      label: "所有",
      value: "all"
    }
  ]
  rangeDate: Array<Date> = []

  timeRange: TimeRange

  ngOnInit(): void {
    // this.setDateRangePicker.bind(this)
  }

  // 今天、本周、本月、所有之一选中时触发
  timeSelectChange(data: IDataList) {
    this.rangeDate = []
    switch(data.value) {
      case "today": {
        const { startTime, endTime } = this.utils.getTodayStartEnd()
        this.timeRange = { startTime, endTime }
        break;
      }
      case "thisWeek": {
        const { startTime, endTime } = this.utils.getWeekStartEnd()
        this.timeRange = { startTime, endTime }
        break;
      }
      case "thisMonth": {
        const { startTime, endTime } = this.utils.getMonthStartEnd()
        this.timeRange = { startTime, endTime }
        break;
      }
      case "all": {
        this.timeRange = { startTime: 0, endTime: 0 }
        break;
      }
    }
    this.timeChange.emit(this.timeRange)
  }

  // 时间选择框值改变
  handleRangeDateChange(date: Date[]) {
    (this.groupSelectBlock as GroupSelectBlockComponent).clearCheckedList();
    if(date.length) {
      this.timeRange = { startTime: moment(date[0]).valueOf(), endTime: moment(date[1]).valueOf() }
    } else {
      this.timeRange = { startTime: 0, endTime: 0 }
    }
    this.timeChange.emit(this.timeRange)
  }

  // 获取时间
  public getTimeRange(): TimeRange {
    return this.timeRange
  }

  // 设置date-range-picker值
  public setDateRangePicker(date?: TimeRange) {
    if(date) {
      this.rangeDate = [new Date(date.startTime), new Date(date.endTime)]
      this.handleRangeDateChange(this.rangeDate)
    } else {
      this.rangeDate = []
    }
  }
}
