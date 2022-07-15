import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { EntityType } from '@shared/models/entity-type.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityId } from '@app/shared/models/id/entity-id';
import { EntityComponent } from '@app/modules/home/components/entity/entity.component';
import { EntityViewInfo, PageLink } from '@app/shared/public-api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '@app/core/http/device.service';
import { UserService } from '@app/core/http/user.service';
import { ResumeChromicleService } from '@app/core/http/resume-chronicle.service';
import { differenceInCalendarDays } from 'date-fns';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tb-add-chromicle-model',
  templateUrl: './add-chromicle-model.component.html',
  styleUrls: ['./add-chromicle-model.component.scss']
})
export class AddChromicleModelComponent implements OnInit {

  @Input() isAddData: boolean;
  @Output() offModel = new EventEmitter(); 
  @Output() submitSuccess = new EventEmitter(); 
  constructor(private fb: FormBuilder, 
    private deviceService: DeviceService, 
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private resumeChromicleService: ResumeChromicleService,
    private message: NzMessageService
  ) { }

  validateAddForm: FormGroup;
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

  defaultData: {} = {
    equipmentName: [null, [Validators.required]],
    resumeType: [null, [Validators.required]],
    personInCharge: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
    participants: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
    workStartTime: [null, [Validators.required]],
    workEndTime: [null, [Validators.required]],
    workConent: [null]
  }
  ngOnInit(): void {
    this.validateAddForm = this.fb.group(this.defaultData);
  }

  modelCancel() {
    this.validateAddForm.reset();
    for (const key in this.validateAddForm.controls) {
      this.validateAddForm.controls[key].markAsPristine();
      this.validateAddForm.controls[key].updateValueAndValidity();
    }
    this.offModel.emit(false)
    this.submitSuccess.emit()
  }

  handleOk(value) {
    // console.log('value', value);
    
    // console.log('validateAddForm',this.validateAddForm);

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
          id: value?.equipmentName
        }
      },
      type: parseInt(value?.resumeType),
      descr: value?.workConent || '',
      beginTime: +new Date(value?.workStartTime),
      endTime: +new Date(value?.workEndTime)
    }
   
    _this.resumeChromicleService.addChronicleData(addData).subscribe( (res)=> {
      _this.modelCancel()
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


  // 重置
  handleReset(e) {
    e.preventDefault();
    this.validateAddForm.reset();
    for (const key in this.validateAddForm.controls) {
      this.validateAddForm.controls[key].markAsPristine();
      this.validateAddForm.controls[key].updateValueAndValidity();
    }
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
