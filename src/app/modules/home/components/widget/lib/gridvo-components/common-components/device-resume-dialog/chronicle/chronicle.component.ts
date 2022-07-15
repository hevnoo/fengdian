import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '@app/core/http/device.service';
import { ResumeChromicleService } from '@app/core/http/resume-chronicle.service';
import { UserService } from '@app/core/http/user.service';
import { PageLink } from '@app/shared/public-api';
import { WidgetContext } from '@home/models/widget-component.models';
import { BehaviorSubject } from 'rxjs';
import * as device from '../device-resume-dialog.module'
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'tb-chronicle',
  templateUrl: './chronicle.component.html',
  styleUrls: ['./chronicle.component.scss']
})
export class ChronicleComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Input() deviceId: string

  public chronicleList = []
  public chronicleTheadData
  public isVisible  // 是否开启弹窗
  public isOkLoading = false

  page = {
    page: 1,
    pageSize: 10,
    total: 0 
  }

  resumeTypeMap = new Map<string, string>()
    .set('CREATE', '巡检')
    .set('UPDATE', '定检')
    .set('DELETE', '检修')
    .set('REPAIR', '故障维修')
  
  constructor(
    private resumeChromicleService: ResumeChromicleService,
    private fb: FormBuilder, 
    private deviceService: DeviceService, 
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private message: NzMessageService
    ) { }

  validateAddForm: FormGroup;

  selectedUser = null;
  isLoading = false;
  pageLink = new PageLink(1000, 0);
  hasNext = true
  searchChange$ = new BehaviorSubject('');
  deviceOption = [];
  personOption = [];

  ngOnInit(): void {
    
    this.chronicleTheadData = device.chronicleThead
    this.getNewData(this.page)
    this.onDeviceSearch('')
  }

  ngOnChanges() {
    console.log(this.deviceId, "设备id")
    this.validateAddForm = this.fb.group({
      equipmentName: [{value:this.deviceId, disabled: true}, [Validators.required]],
      resumeType: [null, [Validators.required]],
      personInCharge: [null, [Validators.required]],
      participants: [null, [Validators.required]],
      workStartTime: [null, [Validators.required]],
      workEndTime: [null, [Validators.required]],
      workConent: [null]
    });
  }

  // 重置弹窗数据
  handleReset(e){
    e.preventDefault();
    this.validateAddForm.reset();
    for (const key in this.validateAddForm.controls) {
      this.validateAddForm.controls[key].markAsPristine();
      this.validateAddForm.controls[key].updateValueAndValidity();
    }
  }

  // 获取列表数据
  getNewData(e) {
    // console.log('ppp', e);
    
    let query = `page=${e.page-1}&pageSize=${e.pageSize}&deviceId=${this.deviceId}`

    let that = this
    this.resumeChromicleService.getPageInfo(query).subscribe(res => {
      // console.log('getData', res);
      let arr = []
      res.data.forEach(item => {
        console.log(item);
        let val = {
          resumeType: this.resumeTypeMap.get(item.type),
          deviceName: item.device?.label.split('#')[1] ? `#${item.device?.label.split('#')[1]}` : item.device?.label,
          workContent: item.descr,
          personInCharge: item.principal || '',
          participant: item.participant || '',
          workStartTime: that.datePipe.transform(item.beginTime, 'yyyy-MM-dd HH:mm:ss'),
          workEndTime: that.datePipe.transform(item.endTime, 'yyyy-MM-dd HH:mm:ss'),
          recorder: item.creator?.firstName || ''
        }
        
        arr.push(val)
        
      })
      this.chronicleList = arr
      // console.log('tabel', this.chronicleList);
      
      this.cd.detectChanges()
      this.page.total = res?.totalElements || 0
    })
  }

 
  onDeviceSearch(value: string): void {
    this.isLoading = true;
    this.pageLink.textSearch = value
    this.pageLink.page = 0
    this.deviceService.getTenantDeviceInfos(this.pageLink, "").subscribe(data => {
      this.hasNext = data.hasNext
      if (data.hasNext) {
        this.pageLink.page += 1
      }
      if (data.data) {
        this.deviceOption = []
      }
      this.isLoading = false;
      data.data.forEach(item => {
        this.deviceOption.push({
          label: item.label,
          value: item.id.id
        })
      });
      this.cd.detectChanges()
    });
  }


  // 保存数据
  handleOk(value) {
    // console.log(value);
    // this.isLoading = true
    if(+new Date(value.workEndTime) < +new Date(value.workStartTime)) {
      this.createMessage()
      return 
    }
    let _this = this
    let addData = {
      principal: value?.personInCharge || '',
      participant: value?.participants.split(",") || [''],
      device: {
        id: {
          entityType: "DEVICE",
          id: this.deviceId
        }
      },
      type: parseInt(value?.resumeType),
      descr: value?.workConent || '',
      beginTime: +new Date(value?.workStartTime),
      endTime: +new Date(value?.workEndTime)
    }
   
    _this.resumeChromicleService.addChronicleData(addData).subscribe( (res)=> {
      _this.getNewData(_this.page)
      _this.modelCancel()
      
    })
  }

  // 开启弹窗
  isShowModel(e) {
    this.isVisible = e
  }

  // 关闭弹窗
  modelCancel(){
    this.validateAddForm.reset({equipmentName: this.deviceId});
    for (const key in this.validateAddForm.controls) {
      this.validateAddForm.controls[key].markAsPristine();
      this.validateAddForm.controls[key].updateValueAndValidity();
    }
    // this.getNewData(this.page)
    this.isVisible = false
    
  }

  createMessage(): void {
    this.message.create('error', '工作结束时间不能小于工作开始时间');
  }
  
}
