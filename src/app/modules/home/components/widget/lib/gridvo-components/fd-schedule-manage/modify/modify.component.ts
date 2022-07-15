import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { dateFormat } from "@gwhome/common/utils/day-utils-func";
import type { IDialogEmiter } from "../type";
import { DialogEmiterType } from "../enum/enum";
import { GwValidators } from "@app/core/validators/GwValidators";

@Component({
  selector: "tb-shcedule-modify",
  templateUrl: "./modify.component.html",
  styleUrls: ["./modify.component.scss"],
})
export class ModifyComponent implements OnInit {
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}
  /**初始化内容，会根据 this.dialogConfig的配置信息来进行初始化值*/
  ngOnInit(): void {
    this.loadDialogConfig();
    this.dateFormat = dateFormat;
  }

  /**
   * 加载dialog初始值，并且配置。
   */
  loadDialogConfig() {
    if (this.dialogConfig.isRequire) {
      this.validateForm = this.fb.group({
        name: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          Validators.required
        ),
        workShfit: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          Validators.required
        ),
        phone: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          [Validators.required, GwValidators.verifyPhone]
        ),
        workTime: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          Validators.required
        ),
        networkId: new FormControl({
          value: null,
          disabled: this.dialogConfig.isDisable,
        }),
        require: [this.dialogConfig.isRequire],
      });
    } else {
      this.validateForm = this.fb.group({
        name: [null],
        workShfit: [null],
        phone: [null],
        workTime: [null],
      });
    }
  }
  /*tplModalButtonLoading按钮加载状态，isVisible提示框是否显示 */
  @Input() dialogStateConfig = {
    tplModalButtonLoading: false,
    isVisible: false,
  };
  /*传递给父组件，取消显示信息 */
  @Output() cancel = new EventEmitter<IDialogEmiter>();

  date = new Date();

  /*主要样式配置，宽度百分比，label表示左侧的label，control表示右侧的输入框之类。 */
  @Input() itemConfig = {
    label: 5,
    control: 19,
    nzXsWidth: 24,
  };

  /*主要配置内容，主要为：姓名、是否是必填的（修改按钮会用）、是否是禁用的。 */
  @Input() dialogConfig = {
    title: "修改排班",
    isRequire: true,
    isDisable: false,
  };
  /**验证表单 */
  validateForm!: FormGroup;
  public get showValidateForm() {
    return this.validateForm;
  }

  setLoading(loading = false) {
    this.dialogStateConfig.tplModalButtonLoading = loading;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**点击提交按钮时候调用，获取validateForm中的数据 */
  submitForm(): void {
    if (this.validateForm.valid) {
      this.cancel.emit({
        type: DialogEmiterType.MODIFY,
        value: {
          flag: false,
          content: this.validateForm,
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  /**触发取消弹框事件，像父组件传递值 */
  handleCancel(e?: MouseEvent): void {
    e?.preventDefault();
    this.cancel.emit({
      type: DialogEmiterType.MODIFY_DESTORY,
      value: {
        flag: false,
        content: this.validateForm,
      },
    });
  }
  dateFormat: (stamp: any, format: any) => any;
  filePrevent(e: MouseEvent) {
    this.dialogStateConfig.tplModalButtonLoading = true;
    e.preventDefault();
  }
}
