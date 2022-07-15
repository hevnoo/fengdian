import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { MessageManageService } from '@app/core/http/mesage-manage.service'
import { NzTableQueryParams } from 'ng-zorro-antd/table';
@Component({
  selector: 'tb-fd-reservice-model',
  templateUrl: './reservice-model.component.html',
  styleUrls: ['./reservice-model.component.scss']
})
export class ReserviceModelComponent implements OnInit {
  isVisible: boolean = false
  tableSendData
  SendName: string
  constructor(private messageManageService: MessageManageService,
    private message: NzMessageService,
    public datePipe: DatePipe
  ) { }
  ngOnInit(): void {
  }
  handleCancel() {
    this.isVisible = false
  }
  handleOk() {
    this.isVisible = false
  }
  public openDoilage(id: string, name: string = "") {
    this.isVisible = true
    this.SendName = name
    this.messageManageService.myReceivedDetail(id).subscribe((data) => {
      this.tableSendData = data
    }, err => {
      console.log(err, '信息错误')
      this.message.error(err)
    })
  }
}