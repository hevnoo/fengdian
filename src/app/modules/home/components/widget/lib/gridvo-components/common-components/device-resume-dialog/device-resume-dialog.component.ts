import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';

interface deviceInfo {
  entityId: string;
  [propname: string]: any;
}
@Component({
  selector: 'tb-device-resume-dialog',
  templateUrl: './device-resume-dialog.component.html',
  styleUrls: ['./device-resume-dialog.component.scss']
})
export class DecResumeDialogComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Input() isShowModel: boolean;
  @Input() detailItem: deviceInfo;
  @Input() timeseriesData: any; 
  @Input() fullDeviceData: deviceInfo[]
  @Input() deviceId: string;
  @Output() offModel = new EventEmitter(); 


  constructor() { }

  ngOnInit(): void {
  
  }
  
  showModal() {
    this.isShowModel = true
  }
  offModelOfDevice(boo){
    this.isShowModel = boo
  }
  modelCancel() {
    this.offModel.emit(false)  
  }

  
 
}
