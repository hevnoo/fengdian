import { I } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '@app/core/http/device.service';
import { ResumeChromicleService } from '@app/core/http/resume-chronicle.service';
import { UserService } from '@app/core/http/user.service';
import { PageLink } from '@app/shared/public-api';
import { BehaviorSubject } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'tb-change-chromicle-model',
  templateUrl: './change-chromicle-model.component.html',
  styleUrls: ['./change-chromicle-model.component.scss']
})
export class ChangeChromicleModelComponent implements OnInit {
  @Input() isChangeData: boolean
  @Input() formData: any
  @Output() offModel = new EventEmitter() 
  @Output() submitSuccess = new EventEmitter() 

  constructor(private fb: FormBuilder, 
    private deviceService: DeviceService, 
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private resumeChromicleService: ResumeChromicleService,
    private message: NzMessageService
  ) { }

  validatechangeForm: FormGroup;

  disabledDate: any
  endTimeTip: string
  startDate: any
  selectedUser = null;
  isLoading = false;
  pageLink = new PageLink(1000, 0);
  hasNext = true
  searchChange$ = new BehaviorSubject('');
  deviceOption = [];
  personOption = [];
  public changeData = {}
  
  resumeTypeMap = new Map<string, string>()
  .set('巡检', "0")
  .set('定检', "1")
  .set('检修', "2")
  .set('故障维修', "3")


  ngOnInit(): void {
    this.getUserOption()
    this.onDeviceSearch('')
  }

  ngOnChanges() {
    this.validatechangeForm = this.fb.group({
      taskNumber: new FormControl({value: this.formData?.id || '', disabled: true}, Validators.required),
      equipmentName: [this.formData?.deviceId || '', Validators.required],
      resumeType: [this.resumeTypeMap.get(this.formData?.resumeType) || '', Validators.required],
      personInCharge: [this.formData?.personInCharge || '', [Validators.required, , Validators.minLength(1), Validators.maxLength(35)]],
      noteTaker: [this.formData?.recorderId || '', Validators.required],
      participants: [this.formData?.participant || '', [Validators.required, , Validators.minLength(1), Validators.maxLength(35)]],
      workStartTime: [+new Date(this.formData?.workStartTime) || '',Validators.required],
      workEndTime: [+new Date(this.formData?.workEndTime) || '', Validators.required],
      workConent: [this.formData?.workContent || '']
    });
    this.monitorData()

  }

  modelCancel() {
    this.validatechangeForm.reset();
    for (const key in this.validatechangeForm.controls) {
      this.validatechangeForm.controls[key].markAsPristine();
      this.validatechangeForm.controls[key].updateValueAndValidity();
    }
    this.offModel.emit(false)
    this.submitSuccess.emit()
  }

  handleOk(value) {
    if(+new Date(value.workEndTime) < +new Date(value.workStartTime)) {
      this.createMessage()
      return 
    }
    let _this = this 
    _this.resumeChromicleService.changeChronicleData(_this.changeData).subscribe(() => {
      _this.changeData = {}
      _this.modelCancel()
    })
  }

  // 监测表单变化
  monitorData() {
    let _this = this
    _this.changeData['id']= _this.formData?.id
    _this.validatechangeForm.get("equipmentName")?.valueChanges.subscribe((data) => {
      
      if (Boolean(data) && Boolean(data !== _this.formData?.deviceId)) {
        _this.changeData['device'] = {
          id: {
            entityType: 'DEVICE',
            id: data
          }
        }
      }
    })
    _this.validatechangeForm.get("resumeType")?.valueChanges.subscribe((data) => {
      if ( Boolean(data) && Boolean(data !== _this.resumeTypeMap.get(_this.formData?.resumeType))) {
        _this.changeData['type'] = parseInt(data)
      }
    })
    _this.validatechangeForm.get("personInCharge")?.valueChanges.subscribe((data) => {
      if ( Boolean(data) && Boolean(data !== this.formData?.personInCharge)) {
        _this.changeData['principal'] = data
      }
    })
    _this.validatechangeForm.get("workStartTime")?.valueChanges.subscribe((data) => {
      if (Boolean(data)) {
        let time = +new Date(data)
        if (time !== +new Date(this.formData?.workStartTime)) {
          _this.changeData['beginTime'] = time
        }
      }
    })
    _this.validatechangeForm.get("workEndTime")?.valueChanges.subscribe(data => {
      if (Boolean(data)) {
        let time = +new Date(data)
        if (time !== +new Date(this.formData?.workEndTime)) {
          _this.changeData['endTime'] = time
        }
      }
    })
    _this.validatechangeForm.get("workConent")?.valueChanges.subscribe(data => {
      if (Boolean(data) && Boolean(data !== _this.formData?.workContent)) {
        _this.changeData['descr'] = data
      }
    })

    _this.validatechangeForm.get("participants")?.valueChanges.subscribe(data => {
      if (Boolean(data)) {
        let val =  data?.split(',') || ''
        if (val !== _this.formData?.participant) {
          _this.changeData["participant"] = val
        }
      }
    })
  }

  // 获得用户数据，渲染select选择器
  getUserOption() {
    this.personOption = []
    let pageLinkOfUser = new PageLink(1000, 0);
    this.userService.getUsers(pageLinkOfUser).subscribe(res => {
      if (res) {
        let userList = []
        res.data.forEach(item => {
          userList.push({
            label: `${item.firstName || ""}${item.lastName || ""}`,
            value: item.id.id
          })
        })
        this.personOption = userList
      }
    }, err => {
      console.log("查找人员err", err)
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

    // 选中开始日期后
    checkStartDate(e) {
      // console.log('选择的日期',e);  
      this.startDate = e
      let time = +new Date(e)
      this.disabledDate = (current: Date): boolean =>
      differenceInCalendarDays(current, time) < 0
      
    }

    createMessage(): void {
      this.message.create('error', '工作结束时间不能小于工作开始时间');
    }

}
