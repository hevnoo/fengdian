import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '@app/core/http/device.service';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import moment from 'moment'
import { AttributeService } from "@core/http/attribute.service";
import { AttributeScope } from "@shared/models/telemetry/telemetry.models";
import { Datasource } from '@app/shared/models/widget.models';

@Component({
  selector: 'tb-fd-monitor-table',
  templateUrl: './fd-monitor-table.component.html',
  styleUrls: ['./fd-monitor-table.component.scss']
})
export class FdMonitorTableComponent implements OnInit {
  @Input() ctx: WidgetContext
  thData = []
  listOfData = []
  pagination = {
    total: 0,
    page: 1,
    pageSize: 10
  }
  tableDataObj = {} // 对象形式的表格数据
  rootDeviceListSet: Set<string> = new Set()
  rootDeviceLis = {}
  attrNameMap: Map<string, any> = new Map()

  constructor(
    private deviceService: DeviceService,
    private attributeService: AttributeService
  ) { }

  ngOnInit(): void {
    this.ctx.$scope.FdMonitorTable = this
    let arr: Datasource[] = []
    Promise.all(this.ctx.datasources.map(i => {
      arr.push(i)
      return this.attributeService.getEntityAttributes(i.entity.id, AttributeScope.SERVER_SCOPE).toPromise()
    })).then(values => {
      values.forEach((i, index) => {
        let label = ""
        i.forEach(j => {
          if (j.key === "sensorPosition") {
            label = `测点${j.value}`
          }
        })
        if (label) {
          this.attrNameMap.set(arr[index].name, { label: label, prop: "cd" })
        }
      })
    })
    this.setheadColumns()
    this.initTableDataObj()
    this.getRootDevice()
  }

  getRootDevice() {
    Promise.all(Array.from(this.rootDeviceListSet).map(i => {
      return this.deviceService.getDevice(i).toPromise()
    })).then(values => {
      values.forEach(i => {
        const { id } = i.id
        this.rootDeviceLis[id] = i
      })
    })
  }

  /**
   * @description 初始化table data
   * @returns { "tower_sensor1": { origin: 原数据 } }
   */
  initTableDataObj() {
    this.tableDataObj = {}
    this.ctx.datasources.forEach((i) => {
      if (i.aliasName === "关联传感器") {
        this.tableDataObj[i.name] = { origin: i }
        this.rootDeviceListSet.add(i.entityFilter.rootEntity.id)
      }
    })
  }

  // 设置列表数据
  setTableDataObj() {
    try {
      // set table data object
      this.initTableDataObj()
      let notSensorData = []
      this.ctx.data.forEach(i => {
        if (i.datasource.aliasName === "关联传感器") {
          const sourceName = i.datasource.name
          const keyName = i.dataKey.name
          i.data.forEach(j => {
            const stamp = j[0]
            const value = j[1]
            if (!this.tableDataObj[sourceName]['items']) {
              this.tableDataObj[sourceName]['items'] = {}
            }
            if (!this.tableDataObj[sourceName]['items'][stamp]) {
              this.tableDataObj[sourceName]['items'][stamp] = {}
            }
            this.tableDataObj[sourceName]['items'][stamp][keyName] = value
          })
        } else {
          // 不是传感器的数据保存下来，等循环结束后取对应时间戳得到数据
          notSensorData.push(i)
        }
      })
      // 循环结束，将对应的时间戳数据放进对象里
      Object.values(this.tableDataObj).forEach((value) => {
        if ((value as any).items) {
          const items = (value as any).items
          Object.entries(items).forEach(([itemKey, itemValue]) => [
            notSensorData.forEach(i => {
              i.data.forEach(j => {
                if (itemKey == j[0]) {
                  itemValue[i.dataKey.name] = j[1]
                }
              })
            })
          ])
        }
      })
    } catch {
      this.initTableDataObj()
    }
  }

  // 设置table数据
  setListData() {
    let arr = []
    for (const [key, value] of Object.entries(this.tableDataObj)) {
      if ((value as any).items) {
        Object.entries((value as any).items).forEach(([vKey, vValue]) => {
          arr.push({
            ...(vValue as any),
            [this.attrNameMap.get(key).prop]: this.attrNameMap.get(key).label,
            time: moment(Number(vKey)).format("YYYY-MM-DD HH:mm:ss"),
            no: this.rootDeviceLis[(value as any).origin.entityFilter.rootEntity.id].label.split("/").pop()
          })
        })
      }
    }
    if (this.ctx.$scope?.searchValue?.measuringValue) {
      arr = arr.filter(i => i.cd === this.ctx.$scope.searchValue.measuringValue)
    }

    this.listOfData = arr
  }

  // 设置头部列表
  setheadColumns() {
    this.ctx.datasources.forEach(i => {
      i.dataKeys.forEach(j => {
        if (!this.thData.some(k => k.name === j.name)) {
          this.thData.push(j)
        }
      })
    })
    this.thData.unshift({ label: "风机编号", name: "no" }, { label: "测点", name: 'cd' })
    this.thData.push({ label: "时间", name: "time" })
  }

  public onDataUpdated() {
    this.setTableDataObj()
    this.setListData()
    this.ctx.detectChanges()
  }

  pageIndexChange(page: number) {
    console.log('page', page)
  }

  pageSizeChange(pageSize: number) {
    console.log('pageSize', pageSize)
  }
}
