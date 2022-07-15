import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { AttributeService } from "@core/http/attribute.service";
import { AttributeScope } from "@shared/models/telemetry/telemetry.models";
import moment from 'moment';
import { GridvoUtilsService } from '@app/core/services/gridvo-utils.service'

@Component({
  selector: 'tb-fd-tower-search',
  templateUrl: './fd-tower-search.component.html',
  styleUrls: ['./fd-tower-search.component.scss']
})
export class FdTowerSearchComponent implements OnInit, AfterViewInit {
  @Input() ctx: WidgetContext
  @Output() search = new EventEmitter();

  timeRange: { startTime: number; endTime: number; };
  rangeDate: Array<Date> = []
  measuringValue: string
  measuringOptions: { label: string, value: string, sort: number }[] = []
  sampleTimeValue: number

  constructor(
    private attributeService: AttributeService, 
    private gridvoUtilsService: GridvoUtilsService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    Promise.all(this.ctx.datasources.map(i => {
      return this.attributeService.getEntityAttributes(i.entity.id, AttributeScope.SERVER_SCOPE).toPromise()
    })).then(values => {
      values.forEach((i) => {
        let label = ""
        let sort = 0
        i.forEach(j => {
          if(j.key === "sensorPosition") {
            label = `测点${j.value}`
            sort = j.value
          }
        })
        if(label) {
          this.measuringOptions.push({
            label: label,
            value: label,
            sort: sort,
          })
        }
      })

      this.measuringOptions.sort((a, b) => a.sort - b.sort)
      const _measuringValue = sessionStorage.getItem("measuringValue")
      this.measuringValue = _measuringValue || this.measuringOptions[0].value
      this.rangeDate = [new Date(this.ctx.timeWindow.minTime), new Date(this.ctx.timeWindow.maxTime)]
      this.handleSearch()
    })
  }

  // 时间选择框值改变
  handleRangeDateChange(date: Date[]) {
    if (date.length) {
      const { y: sy, m: sm, d: sd } = this.gridvoUtilsService.getYMD(date[0])
      const { y: ey, m: em, d: ed } = this.gridvoUtilsService.getYMD(date[1])
      this.timeRange = { startTime: moment(`${sy}-${sm + 1}-${sd} 00:00:00`).valueOf(), endTime: moment(`${ey}-${em + 1}-${ed} 23:59:59`).valueOf() }
      this.rangeDate[0] = new Date(this.timeRange.startTime)
      this.rangeDate[1] = new Date(this.timeRange.endTime)
    } else {
      this.timeRange = { startTime: 0, endTime: 0 }
    }
  }

  // 搜索
  handleSearch() {
    this.ctx.timewindowFunctions.onUpdateTimewindow(this.rangeDate[0].getTime(), this.rangeDate[1].getTime())
    sessionStorage.setItem("measuringValue", this.measuringValue)
    this.emitSearch()
  }

  // 触发search
  emitSearch() {
    this.search.emit({
      timeRange: this.timeRange,
      rangeData: this.rangeDate,
      measuringValue: this.measuringValue,
      sampleTimeValue: this.sampleTimeValue
    })
  }
}
