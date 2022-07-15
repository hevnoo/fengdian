import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import * as device from '../device-resume-dialog.module'

interface deviceInfo {
  entityId: string;
  [propname: string]: any;
}
@Component({
  selector: 'tb-telemetry-properties',
  templateUrl: './telemetry-properties.component.html',
  styleUrls: ['./telemetry-properties.component.scss']
})
export class TelemetryPropertiesComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Input() item: deviceInfo;
  @Input() timeseriesData: any;
  public remoteList = []
  public remoteTheadData
  public total
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {  
    this.remoteTheadData = device.remoteThead
  }
  ngOnChanges() {
    console.log('timeseriesData',this.timeseriesData);
    this.timeseriesData?.forEach(item => {
      let obj = {
        keyName: item?.name || '',
        value: item?.val || '',
        newSetTime: this.datePipe.transform(item?.newestTime, 'yyyy-MM-dd HH:mm:ss')
      }
      this.remoteList.push(obj)
    })
    this.total = this.timeseriesData?.length
  }
  
}
