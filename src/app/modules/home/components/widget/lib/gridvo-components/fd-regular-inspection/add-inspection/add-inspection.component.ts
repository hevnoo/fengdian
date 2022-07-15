import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { disableDebugTools } from "@angular/platform-browser";
import { RegularInspectionService } from "@app/core/http/regular-inspection.service";
import { FormControl } from "@material-ui/core";
import { NzMessageService } from 'ng-zorro-antd/message';
import { SelectDeviceComponent } from '@home/components/widget/lib/gridvo-components/common-components/select-device/select-device.component'
import { differenceInCalendarDays } from 'date-fns';
@Component({
    selector: 'tb-fb-add-inspection',
    templateUrl: './add-inspection.component.html',
    styleUrls: ['./add-inspection.component.scss']
  })
export class AddInspectionComponent implements OnInit {
    @Input() isAdd: boolean = false
    @Input() isChange: boolean = false
    @Input() formData: any = {}    
    @Output() closeModel =  new EventEmitter()
    @Output() requestData = new EventEmitter()
    @ViewChild("selcetDevice") selcetDevice: SelectDeviceComponent

    public devDefault = ''
    public validateAddForm: FormGroup = this.fb.group({})
    public deviceOption: any[] = []
    public isLoading: boolean = false
    public devId: any
    public changeData = {}
    public startTime: number
    public endTime: number
    public isDevDisable: boolean = false
    public disabledDate: any
    constructor(
      private fb: FormBuilder, 
      private regularInspectService :RegularInspectionService,
      private message: NzMessageService
      ) {}


    ngOnInit(): void {
      this.devDefault = ''
      let time = +new Date()
      this.disabledDate = (current: Date): boolean => differenceInCalendarDays(current, time) > 0
    }

    ngOnChanges() {
      // console.log(this.formData, '查询formData');
      if( this.formData?.type == 1 ) {
        this.isDevDisable = true
      }else {
        this.isDevDisable = false
      }
      
      this.validateAddForm = this.fb.group({
        name: [{value: this.formData?.name || null, disabled: this.isDevDisable},[Validators.required]],
        // inspectDevice: [null, [Validators.required]],
        commissioningTime: [ this.formData?.commissioningTime || null],
        periodDay: [this.formData?.periodDay || null, [Validators.required]],
        lastCreateTime: [this.formData?.lastCreateTime || null, [Validators.required]],
        lastCompletedTime: [this.formData?.lastCompletedTime || null, [Validators.required]],
        descr: [{value: this.formData?.descr || null, disabled: this.isDevDisable}]
      });
      if (this.isChange) {
        this.devDefault = this.formData?.device?.id?.id
        this.monitorFormData()
      }else {
        this.devDefault = ""
      }
    }

    modelCancel() {
      this.validateAddForm.reset()
      this.selcetDevice.resetDeveceDataForm()
      for (const key in this.validateAddForm.controls) {
        this.validateAddForm.controls[key].markAsPristine();
        this.validateAddForm.controls[key].updateValueAndValidity();
      }
      this.closeModel.emit(false)
      this.requestData.emit()
    }

    handleOk(value) {
      if(value.name.length > 32) {
        this.message.create('error', '工作计划不能超过32个字符');
        return
      }
      if(+new Date(value.lastCompletedTime) < +new Date(value.lastCreateTime)) {
        this.createMessage()
        return 
      }
      if (this.isAdd) {
        value['device'] = {
          id: {
            entityType: "DEVICE",
            id: this.devId
          }
        }
        value['type'] = 2
        // console.log(value, '添加的数据');
        this.regularInspectService.addNewData(value).subscribe(res => {
            this.modelCancel()
            this.message.create('success', '添加成功！')
        }, err => {
          // console.log(err);
          
          this.message.create('error', `${err.error?.detail || '添加失败!'}`)
        })
      }
      if(this.isChange) {
        // console.log(this.changeData);
        if(this.formData?.type == 2 && !!this.devId && this.devId !== this.formData.device?.id?.id) {
          this.changeData['device'] = {
            id: {
              entityType: "DEVICE",
              id: this.devId
            }
          }
        }
        this.regularInspectService.changeData(this.changeData).subscribe(() => {
          this.changeData = {}
          this.modelCancel()
          this.message.create('success', '修改成功！')
        }, err => {
          this.message.create('error', '修改失败！')
        })
        
      }
      
      
    }

    // 监听表单发生变化
    monitorFormData() {
      this.changeData['id'] = this.formData?.id
      this.monitorMethod('name')
      this.monitorMethod('periodDay')
      this.monitorMethod('lastCreateTime')
      this.monitorMethod('lastCompletedTime')
      this.monitorMethod('commissioningTime')
      this.monitorMethod('descr')
      // console.log(this.changeData)
    }

    // 监听表单处理方法
    monitorMethod(formName) {
      this.validateAddForm.get(`${formName}`).valueChanges.subscribe(data => {
        // console.log(data, "data ----", this.formData?.[formName])
        if(!!data && !!(data !== this.formData?.[formName])) {
          // console.log(formName, 'data...', data)
          this.changeData[formName] = data
        }
      })
    }
    
    // 获取设备选择器传递的设备ID
    getDevData(e) {
      this.devId = e
      console.log('设备ID',e);
      
    }

    // 选择开始时间触发的函数
    chanceStartTime(time) {

      this.startTime = +new Date(time)
      this.judgeTime()
    }

    // 选中完成时间触发的函数
    chanceEndTime(time) {
      this.endTime = +new Date(time)
      this.judgeTime()
    } 

    // 用于判断完成时间是小于开始时间
    judgeTime() {
      if (this.isChange) {
        let firstStart = +new Date(this.formData?.lastCreateTime)
        let firstEnd = +new Date(this.formData?.lastCompletedTime)
        if ((firstStart > this.endTime || firstEnd < this.startTime || this.endTime < this.startTime) && (!!this.endTime || !!this.startTime)) {
          this.createMessage()
        }
        return
      }
      if (this.endTime < this.startTime && !!this.endTime) {
        this.createMessage()
      }
    }

    createMessage() {
      this.message.create('error', '工作结束时间不能小于工作开始时间');
    }
}