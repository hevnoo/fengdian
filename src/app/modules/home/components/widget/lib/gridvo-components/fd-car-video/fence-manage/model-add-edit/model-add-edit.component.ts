import { Component, OnInit, Output, EventEmitter, Input, DoCheck, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CarVideoService } from "../../../common/services/car-video.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import { EleFenceService } from "../../../common/http/ele-fence.service";
import { IFenceTableData } from "../fence-manage.component";

@Component({
  selector: 'tb-model-add-edit',
  templateUrl: './model-add-edit.component.html',
  styleUrls: ['./model-add-edit.component.scss']
})
export class ModelAddEditComponent implements OnInit {
  @ViewChild('stayTimeRef', { static: false }) stayTimeRef: ElementRef;
  @Output() closeAddFenceEmiter = new EventEmitter();
  isAddFenceVisible: boolean = false;
  validateForm!: FormGroup;
  title: string = '新增电子围栏';
  constructor(private fb: FormBuilder,
    private CarVideoService: CarVideoService,
    private message: NzMessageService,
    private EleFenceService: EleFenceService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(10)]],
      type: [null, [Validators.required]],
      status: [null, [Validators.required]],
      stayedTime: [30, [Validators.required]],
      shape: [null, [Validators.required]],
      buffer: [null],
      coordinate: [null, [Validators.required]],
      remark: [null]
    });

    this.CarVideoService.isAddFenceVisible$.asObservable().subscribe(res => {
      this.isAddFenceVisible = res;
    });
    this.CarVideoService.drawData$.asObservable().subscribe(res => {
      if (typeof (res) !== 'undefined') {
        this.validateForm.controls.coordinate.setValue(res.coordinate);
      }
    })
  }

  handleDiaCancel() {
    this.CarVideoService.isAddFenceVisible$.next(false);
    this.validateForm.reset();
  }

  submitForm(value) {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    };
    if (!this.validateForm.valid) return;
    let method = value.id ? "put" : "POST";
    let res = this.checkData(value);
    if (res.code !== 200) {
      this.message.error(res.msg);
      return;
    };
    this.EleFenceService.addOrModifyFence(method, value).subscribe({
      next: () => {
        this.CarVideoService.isAddFenceVisible$.next(false);
        this.closeAddFenceEmiter.emit();
        this.message.success('保存成功!')
        this.validateForm.reset();
      },
      error: err => {
        if(err.status === 400) {
          this.message.warning('电子围栏名称已存在');
        } else {
          this.message.info(err.error.message);
        }
      }
    });
  }

  handleSelectPoints() {
    this.CarVideoService.isDrawFence$.next(true);
    this.CarVideoService.isAddFenceVisible$.next(false);
    this.CarVideoService.isFenceTableVisible$.next(false);
  }

  private checkData(form) {
    let coordinate = null;
    try {
      coordinate = JSON.parse(form.coordinate);
    } catch (error) {
      // coordinate = []
    }
    if (form.shape === "LINESTRING") {
      if (coordinate[1].radius) {
        return {
          code: 400,
          msg: "线性围栏的数据格式有误",
        };
      } else if (!Number(form.buffer) || Number(form.buffer) == 0) {
        return {
          code: 400,
          msg: "围栏缓冲区设置有误",
        };
      } else {
        return {
          code: 200,
          msg: "success",
        };
      }
    } else if (form.shape === "POLYGON") {
      let flag = true;
      if (coordinate instanceof Array) {
        coordinate.forEach((val, i, arr) => {
          if (!(val instanceof Array)) {
            flag = false;
          }
          if(arr[0][0] !== arr[arr.length -1][0]) {
            flag = false;
          }
        });
      } else {
        flag = false;
      }
      if (flag) {
        return {
          code: 200,
          msg: "success",
        };
      } else {
        return {
          code: 400,
          msg: "矩形围栏的数据格式有误",
        };
      }
    } else if (form.shape === "CIRCULAR") {
      let flag = true;
      if (coordinate instanceof Array) {
        try {
          if (
            !(coordinate[0] instanceof Array) ||
            !coordinate[1].radius
          ) {
            flag = false;
          }
        } catch (error) {
          flag = false;
        }
      } else {
        flag = false;
      }

      if (flag) {
        return {
          code: 200,
          msg: "success",
        };
      } else {
        return {
          code: 400,
          msg: "圆形围栏的数据格式有误",
        };
      }
    }
  }
  onChangeStayedTime(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (!isNaN(+value) && reg.test(value)) {
      this.stayTimeRef.nativeElement.value = value;
    } else {
      this.stayTimeRef.nativeElement.value = '';
    }
  }

  public modifyFence(fence: IFenceTableData) {
    this.validateForm.patchValue({ id: fence.id });
    this.validateForm.patchValue({ name: fence.name });
    this.validateForm.patchValue({ type: fence.type === '进围栏告警' ? 'ENTRY_ALARM' : 'LEAVE_ALARM' });
    this.validateForm.patchValue({ status: fence.status === '已开启' ? '1' : '0' });
    this.validateForm.patchValue({ stayedTime: fence.stayedTime });
    this.validateForm.patchValue({
      shape: fence.shape === '线形围栏' ?
        'LINESTRING' : fence.shape === '多边形围栏' ?
          'POLYGON' : 'CIRCULAR'
    });
    this.validateForm.patchValue({ buffer: fence.buffer });
    this.validateForm.patchValue({ coordinate: fence.coordinate });
    this.validateForm.patchValue({ remark: fence.remark });

    this.CarVideoService.isAddFenceVisible$.next(true);
  }
}
