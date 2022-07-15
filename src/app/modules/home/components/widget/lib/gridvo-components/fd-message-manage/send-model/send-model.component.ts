import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { MessageManageService } from '@app/core/http/mesage-manage.service'
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'tb-fd-send-model',
  templateUrl: './send-model.component.html',
  styleUrls: ['./send-model.component.scss']
})
export class SendModelComponent implements OnInit {
  isVisible: boolean = false
  tableSendData = []
  constructor(private messageManageService: MessageManageService,
    private message: NzMessageService,
  ) { }
  ngOnInit(): void {
  }
  handleCancel() {
    this.isVisible = false
  }
  handleOk() {
    this.isVisible = false
  }
  public openDoilage(id: string) {
    this.isVisible = true
    this.tableSendData = []
    this.messageManageService.mySendDetail(id).subscribe(res => {
      this.tableSendData = this.tableSendData.concat(res)
    }, err => {
      console.log(err, '信息错误')
      this.message.error(err)
    })
  }
}