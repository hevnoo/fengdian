import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IDialogEmiter } from "../../type";
import { DialogEmiterType } from "../../enum/enum";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { dateFormat } from "@gwhome/common/utils/day-utils-func";

@Component({
  selector: "tb-frequently-dialog-modify",
  templateUrl: "./dialog-modify.component.html",
  styleUrls: ["./dialog-modify.component.scss"],
})
export class DialogModifyComponent implements OnInit {
  /**构造函数使用到的服务，FormBuilder构建表单 */
  constructor(private fb: FormBuilder) {}
  /**初始化内容，会根据 this.dialogConfig的配置信息来进行初始化值*/
  ngOnInit(): void {
    this.loadDialogConfig();
    this.dateFormat = dateFormat;
  }
  /**
   * 加载dialog初始值，并且配置。
   */
  loadDialogConfig() {
    /**从上到下依次是：主题、类型、内容、创建人、附件，是否是必传的配置信息 */
    if (this.dialogConfig.isRequire) {
      this.validateForm = this.fb.group({
        systemName: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          [Validators.required, Validators.maxLength(50)]
        ),
        link: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          [Validators.required, Validators.maxLength(50)]
        ),
        linkType: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          [Validators.required, Validators.maxLength(50)]
        ),
        remarks: new FormControl({
          value: null,
          disabled: this.dialogConfig.isDisable,
        }),
        creater: new FormControl({ value: null, disabled: true }),
        createTimes: new FormControl({ value: null, disabled: true }),
      });
    } else {
      this.validateForm = this.fb.group({
        systemName: [null],
        link: [null],
        linkType: [null],
        remarks: [null],
        creater: [null],
        createTimes: [null],
      });
    }
    /**全部禁用 */
    Object.keys(this.validateForm.getRawValue()).forEach((key) =>
      this.validateForm.get(key)?.disable()
    );
    /*如果传入的配置对象是选中的那么开启上面三个input输入框也就是：主题、类型、内容。 */
    if (!this.dialogConfig.isDisable) {
      this.validateForm.get("systemName")?.enable();
      this.validateForm.get("link")?.enable();
      this.validateForm.get("linkType")?.enable();
      this.validateForm.get("remarks")?.enable();
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

  /*主要配置内容，主要为：标题、是否是必填的（修改按钮会用）、是否是禁用的。 */
  @Input() dialogConfig = {
    title: "修改",
    isRequire: true,
    isDisable: false,
  };

  /*当作为展示界面时传入此值，用于禁用展示内容 。*/
  @Input() dialogItemPlaceHolder = {
    systemName: "",
    link: "",
    linkType: "",
    remarks: "",
    creater: "",
    createTimes: new Date(),
  };
  selectValue!: string;
  // 验证表单
  validateForm!: FormGroup;
  public get showValidateForm() {
    return this.validateForm;
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
      // this.cancel.emit({
      //   type: DialogEmiterType.MODIFY,
      //   value: {
      //     flag: false,
      //   },
      // });
    }
  }

  /**触发取消弹框事件，像父组件传递值 */
  handleCancel(e?: MouseEvent): void {
    e?.preventDefault();
    this.cancel.emit({
      type: DialogEmiterType.MODIFY_DESTORY,
      value: { flag: false },
    });
  }
  dateFormat: (stamp: any, format: any) => any;
}
