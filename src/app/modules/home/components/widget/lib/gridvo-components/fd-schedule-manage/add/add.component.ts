import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDialogEmiter } from "../type";
import { DialogEmiterType } from "../enum/enum";
import { GwValidators } from "@app/core/validators/GwValidators";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "tb-shcedule-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  dateModal = null;
  isEnglish = false;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private message: NzMessageService
  ) {}
  @Input() dialogStateConfig = {
    isVisible: false,
    tplModalButtonLoading: false,
  };
  /*传递给父组件，取消显示信息 */
  @Output() cancel = new EventEmitter<IDialogEmiter>();

  /**修改状态并刷新 */
  setLoading(loading = false) {
    this.dialogStateConfig.tplModalButtonLoading = loading;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  // 初始化数据格式
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      workShfit: [null, [Validators.required]],
      phone: [null, [Validators.required, GwValidators.verifyPhone]],
      workTime: [null, Validators.required],
    });
  }

  /**表单验证组 */
  validateForm!: FormGroup;

  /*主要样式配置，宽度百分比，label表示左侧的label，control表示右侧的输入框之类。 */
  @Input() itemConfig = {
    label: 5,
    control: 19,
    nzXsWidth: 24,
  };

  /**点击提交按钮时候调用，获取validateForm中的数据 */
  submitForm(): void {
    if (this.validateForm.valid) {
      this.cancel.emit({
        type: DialogEmiterType.ADD,
        value: { flag: false, content: this.validateForm },
      });
    } else {
      this.message.create("error", "请填写正确信息");
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  filePrevent(e: MouseEvent) {
    this.dialogStateConfig.tplModalButtonLoading = true;
    e.preventDefault();
  }
  /**触发取消弹框事件，像父组件传递值 */
  handleCancel(e?: MouseEvent): void {
    e?.preventDefault();
    this.cancel.emit({
      type: DialogEmiterType.ADD_DESTORY,
      value: { flag: false, content: this.validateForm },
    });
  }

  // 日期选择器格式转换为时间戳
  onChange(result: Date): void {
    if (this.validateForm.get("workTime")) {
      this.validateForm.patchValue({
        workTime: result.getTime(),
      });
    }
  }
}
