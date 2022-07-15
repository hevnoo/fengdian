import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { MessageManageService } from '@app/core/http/mesage-manage.service'
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'tb-fd-message-manage',
  templateUrl: './fd-message-manage.component.html',
  styleUrls: ['./fd-message-manage.component.scss']
})
export class FdMessageManageComponent implements OnInit {

  @Input() ctx: WidgetContext;
  selectAllCheck = false
  loading = true
  setSelectId = new Set<number>()
  isFrontPagination = false
  fullDataOfSend = []
  fulldataOfReceved = []
  tableSendData = []
  tableReseiviceData = []
  selectData
  searchText: string = ''
  isClickButon: string = '我发送的'
  isConfirmLoading: boolean = false
  isVisible: boolean = false
  selectDelete = []
  // 分页
  pageSendTotal: number = 100
  pageSendIndex: number = 1
  pageSendSize = 10
  pageReseiviceTotal: number = 100
  pageReseiviceIndex: number = 1
  pageReseiviceSize = 10
  @ViewChild("sendModel", { static: true }) sendModel: any
  @ViewChild("reserviceModel", { static: true }) reserviceModel: any

  constructor(private messageManageService: MessageManageService,
    private message: NzMessageService
  ) { }
  ngOnInit(): void {
    this.ctx.$scope.messageManageWidget = this
    this.loadSendDataFromServer()
    this.loadReseiviceDataFromServer()
    this.getAllMySend()
    this.getAllMyReceived()
  }
  deleteMessage(data, num) {
    this.isVisible = true
    this.selectDelete = [data, num]
  }
  handleCancel() {
    this.isVisible = false
  }
  handleOk() {
    let select = this.selectDelete
    if (select[1] === 0) {
      this.messageManageService.deleteSend(select[0].id).subscribe(res => {
        this.message.success('删除成功')
        this.fullDataOfSend = this.fullDataOfSend.filter(item => item.id !== select[0].id)
        this.tableSendData = this.fullDataOfSend.slice(0, this.pageSendSize)
        this.pageSendIndex = 1
      }, err => {
        this.message.error(err.error.detail)
      })
    } else {
      this.messageManageService.deleteReviced(select[0].id).subscribe(res => {
        this.message.success('删除成功')
        this.fulldataOfReceved = this.fulldataOfReceved.filter(item => item.id !== select[0].id)
        this.tableReseiviceData = this.fulldataOfReceved.slice(0, this.pageReseiviceSize)
        this.pageReseiviceIndex = 1
      }, err => {
        this.message.error(err.error.detail)
      })
    }
    this.selectDelete = []
    this.isVisible = false
  }
  //请求单页
  loadSendDataFromServer(page = this.pageSendIndex, pageSize = this.pageSendSize) {
    if (!this.isFrontPagination) {
      this.messageManageService.mySend({ page: page - 1, pageSize: pageSize }).subscribe(res => {
        this.pageSendTotal = res.totalElements
        this.tableSendData = res.data
        this.ctx.detectChanges()
        this.loading = false
      }, err => {
        console.log(err, '发送信息错误')
        this.message.error(err.error)
        this.loading = false
      })
    }
  }
  loadReseiviceDataFromServer(page = this.pageSendIndex, pageSize = this.pageReseiviceSize) {
    if (!this.isFrontPagination) {
      this.messageManageService.myReceived({ page: page - 1, pageSize: pageSize }).subscribe(res => {
        this.pageReseiviceTotal = res.totalElements
        this.tableReseiviceData = res.data
        this.ctx.detectChanges()
      }, err => {
        console.log(err, '信息错误')
        this.message.error(err)
      })
    }
  }
  onQueryParamsChange(params: NzTableQueryParams, num) {    
    // 0是我发送的，1是我接收的
    const { pageIndex, pageSize } = params
    if (num === 0)
      this.loadSendDataFromServer(pageIndex, pageSize);
    else
      this.loadReseiviceDataFromServer(pageIndex, pageSize);
  }
  getAllMySend() {
    let page = 0
    this.messageManageService.mySend({ page: page, pageSize: 100 }).subscribe(res => {
      if (res.hasNext) {
        this.fullDataOfSend = []
      }
      page++
      this.fullDataOfSend = res.data
      this.ctx.detectChanges()
      this.loading = false
    }, err => {
      console.log(err, '发送信息错误')
      this.message.error(err)
    })
  }
  getAllMyReceived() {
    let page = 0
    this.messageManageService.myReceived({ page: page, pageSize: 100 }).subscribe(res => {
      if (res.hasNext) {
        this.fulldataOfReceved = []
      }
      page++
      this.loading = false
      this.fulldataOfReceved = res.data
      this.ctx.detectChanges()
    }, err => {
      console.log(err, '接收信息错误')
      this.message.error(err)
    })
  }
  changeClickButton(text: string) {
    this.isClickButon = text
    this.setSelectId.clear()
    this.selectAllCheck = false
  }
  handleSearch() {
    this.isFrontPagination = true
    if (this.isClickButon === '我发送的') {
      this.tableSendData = this.fullDataOfSend.filter(item => item.content.includes(this.searchText))
    } else {
      this.tableReseiviceData = this.fulldataOfReceved.filter(item => item.content.includes(this.searchText))
    }
    this.setSelectId.clear()
    this.pageReseiviceIndex = 1
    this.pageSendIndex = 1
    this.selectAllCheck = false
  }
  selectAll(check: boolean, num: number) {
    //不知道为什么选择这个不在document的点击事件中
    //全选以及全不选
    //num的0代表我发送的，1代表我接收的
    if (!check) {
      this.setSelectId.clear()
    } else {
      this.setSelectId.clear()
      if (num === 0) {
        this.tableSendData.map(item => {
          this.setSelectId.add(item.id)
        })
      } else {
        this.tableReseiviceData.map(item => this.setSelectId.add(item.id))
      }

    }
  }
  selectSingle(data, id: number, check: boolean) {
    if (check) {
      this.setSelectId.add(id)
      this.selectData = data
    } else {
      this.setSelectId.delete(id)
    }
    //判断是否全部选择
    if (this.setSelectId.size === this.tableSendData.length || this.setSelectId.size === this.tableReseiviceData.length) this.selectAllCheck = true
    else this.selectAllCheck = false

  }
}