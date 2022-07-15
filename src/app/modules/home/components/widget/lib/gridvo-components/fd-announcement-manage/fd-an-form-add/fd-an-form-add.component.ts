import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { IDialogEmiter } from "../type";
import { DialogEmiterType } from "../enum/enum";
import { FileManagementService } from "@app/core/http/file-management.service";
import { NzUploadFile } from "ng-zorro-antd/upload";

@Component({
  selector: "tb-fd-an-form-add",
  templateUrl: "./fd-an-form-add.component.html",
  styleUrls: ["./fd-an-form-add.component.scss"],
  providers: [NzMessageService],
})
export class FdAnFormAddComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private fileManagementService: FileManagementService,
    private cd: ChangeDetectorRef
  ) {}
  @Input() dialogStateConfig = {
    isVisible: false,
    tplModalButtonLoading: false,
  };
  /*传递给父组件，取消显示信息 */
  @Output() cancel = new EventEmitter<IDialogEmiter>();

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

  /**修改状态并刷新 */
  setLoading(loading = false) {
    this.dialogStateConfig.tplModalButtonLoading = loading;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      theme: [null, [Validators.required, Validators.maxLength(32)]],
      type: [null, [Validators.required]],
      content: [null, [Validators.required]],
    });
    new FormData();
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

  filePrevent(e: MouseEvent) {
    this.dialogStateConfig.tplModalButtonLoading = true;
    e.preventDefault();
  }
  /**触发取消弹框事件，像父组件传递值 */
  handleCancel(e?: MouseEvent): void {
    e?.preventDefault();
    // 清空上传文件
    this.fileList.length = 0;
    this.cancel.emit({
      type: DialogEmiterType.ADD_DESTORY,
      value: { flag: false, content: this.validateForm },
    });
  }
}
