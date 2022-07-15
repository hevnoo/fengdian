import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { IDialogEmiter } from "../../type";
import { DialogEmiterType } from "../../enum/enum";
import { GwValidators } from "@core/validators/GwValidators";

@Component({
  selector: "tb-frequently-dialog-add",
  templateUrl: "./dialog-add.component.html",
  styleUrls: ["./dialog-add.component.scss"],
})
export class DialogAddComponent implements OnInit {
  @Input() dialogStateConfig = {
    isVisible: false,
    tplModalButtonLoading: false,
  };
  /*传递给父组件，取消显示信息 */
  @Output() cancel = new EventEmitter<IDialogEmiter>();
  // @Output() submit = new EventEmitter();

  /**
   * 注入服务
   * @param fb 创建表单组和表单详细
   * @param msg 提交按钮需要的服务
   */
  constructor(private fb: FormBuilder, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      systemName: [null, [Validators.required, Validators.maxLength(50)]],
      link: [
        null,
        [Validators.required, GwValidators.verifyUrl, Validators.maxLength(50)],
      ],
      linkType: [null, [Validators.required]],
      remarks: [null],
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
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      // this.cancel.emit({ type: DialogEmiterType.ADD, value: { flag: false } });
    }
  }

  /**触发取消弹框事件，像父组件传递值 */
  handleCancel(e?: MouseEvent): void {
    this.validateForm.reset();
    e?.preventDefault();
    this.cancel.emit({
      type: DialogEmiterType.ADD_DESTORY,
      value: { flag: false },
    });
  }
  typeChange(e: string) {
    console.log(e);
  }
}
