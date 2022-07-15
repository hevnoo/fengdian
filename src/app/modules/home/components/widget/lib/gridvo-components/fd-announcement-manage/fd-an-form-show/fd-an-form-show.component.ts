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
import { NzMessageService } from "ng-zorro-antd/message";
import { dateFormat } from "@gwhome/common/utils/day-utils-func";
import type { IDialogEmiter } from "../type";
import { DialogEmiterType } from "../enum/enum";
import { NzUploadFile } from "ng-zorro-antd/upload";
import { FileManagementService } from "@app/core/http/file-management.service";

@Component({
  selector: "tb-fd-an-form-show",
  templateUrl: "./fd-an-form-show.component.html",
  styleUrls: ["./fd-an-form-show.component.scss"],
  providers: [NzMessageService],
})
export class FdAnFormShowComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private fileManagementService: FileManagementService,
    private cd: ChangeDetectorRef
  ) {}
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
        theme: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          [Validators.required, Validators.maxLength(32)]
        ),
        type: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          Validators.required
        ),
        content: new FormControl(
          { value: null, disabled: this.dialogConfig.isDisable },
          Validators.required
        ),
        creater: new FormControl({ value: null, disabled: true }),
        ebclosure: new FormControl({ value: null, disabled: true }),
        datepicker: new FormControl({ value: null, disabled: true }),
        networkId: new FormControl({ value: null, disabled: true }),
        require: [this.dialogConfig.isRequire],
      });
    } else {
      this.validateForm = this.fb.group({
        theme: [null, [Validators.required, Validators.maxLength(32)]],
        type: [null],
        content: [null],
        creater: [null],
        ebclosure: [null],
      });
    }
    /**全部禁用 */
    Object.keys(this.validateForm.getRawValue()).forEach((key) =>
      this.validateForm.get(key)?.disable()
    );
    /*如果传入的配置对象是选中的那么开启上面三个input输入框也就是：主题、类型、内容。 */
    if (!this.dialogConfig.isDisable) {
      this.validateForm.get("theme")?.enable();
      this.validateForm.get("type")?.enable();
      this.validateForm.get("content")?.enable();
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
    title: "修改公告",
    isRequire: true,
    isDisable: false,
  };

  /*当作为展示界面时传入此值，用于禁用展示内容 。*/
  @Input() dialogItemPlaceHolder = {
    theme: "",
    type: "",
    content: "",
    creater: "",
    ebclosure: "",
    completeEnclosure: "",
  };
  /**验证表单 */
  validateForm!: FormGroup;
  public get showValidateForm() {
    return this.validateForm;
  }

  fileList: NzUploadFile[] = [];
  fileUrl: string = undefined;
  beforeUpload = (file: NzUploadFile): boolean => {
    const isLt2M = file.size! / 1024 / 1024 < 20;
    if (!isLt2M) {
      this.message.error("只能上传20m内的文件");
      this.setLoading();
      return isLt2M;
    }
    this.fileList = this.fileList.concat(file);
    const formData = new FormData();
    formData.append("auth_token", localStorage.getItem("jwt_token"));
    formData.append("file", this.fileList[0] as any);
    formData.append("scene", "default");
    formData.append("output", "json");
    this.fileManagementService.fileUpload(formData).subscribe(
      (res) => {
        if (res.status === "fail") {
          return this.message.error("上传失败：" + res.message);
        }
        this.message.success("上传成功");
        this.fileUrl = res.path;
        this.validateForm.registerControl(
          "enclosure",
          this.fb.control(this.fileUrl)
        );
        this.setLoading();
      },
      (err) => {
        this.message.error("上传失败：" + err.message);
        this.setLoading();
      }
    );
    return false;
  };

  setLoading(loading = false) {
    this.dialogStateConfig.tplModalButtonLoading = loading;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * 下载文件
   */
  downloadFile() {
    let origin =
      process.env.NODE_ENV === "development"
        ? "http://10.0.5.92:30661"
        : location.origin;
    // download: 1 = 下载， 0 = 打开
    const openUrl = `${origin}/${this.dialogItemPlaceHolder.completeEnclosure}?download=1`;
    window.open(openUrl);
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
      this.fileList.length = 0;
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      // this.handleCancel();
    }
  }

  /**触发取消弹框事件，像父组件传递值 */
  handleCancel(e?: MouseEvent): void {
    e?.preventDefault();
    this.fileList.length = 0;
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
