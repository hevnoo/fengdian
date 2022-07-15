import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DefectManagementService } from "@core/http/defect-management.service";
import { DeviceService } from "@core/http/device.service";
import { FileManagementService } from "@app/core/http/file-management.service";
import { PageLink } from "@shared/models/page/page-link";
import { BehaviorSubject, Observable } from "rxjs";
import { differenceInCalendarDays } from "date-fns";

import { NzMessageService } from "ng-zorro-antd/message";
import { UserService } from "@core/http/user.service";
import { NzShowUploadList, NzUploadFile } from "ng-zorro-antd/upload";
import { Observer } from "rxjs/internal/types";

/*
  缺陷管理-新增、编辑（可编辑）
  缺陷管理-详情、工单管理-办理、工单管理-详情（只读）
*/
@Component({
  selector: "tb-detail-dialog",
  templateUrl: "./detail-dialog.component.html",
  styleUrls: ["./detail-dialog.component.scss"],
})
export class DetailDialogComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() handleCancelCb = new EventEmitter(); //弹窗关闭的回调
  url: string;
  isSubBtnLoading: boolean = false;
  validateForm!: FormGroup;
  openDialogType: string = "readOnly";
  formDisable: boolean = false;
  // fileType:string="image/png,image/jpeg,image/gif,image/bmp,.xls,.xlsx,.doc,.docx,.zip,.rar"
  icons: NzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  // 所属设备
  deviceOption = [];
  // 缺陷类型
  defectTypeOption = [
    { label: "集电线路", value: "集电线路" },
    { label: "母线", value: "母线" },
    { label: "UPS", value: "UPS" },
    { label: "直流屏", value: "直流屏" },
    { label: "主变低压测", value: "主变低压测" },
    { label: "主变高压测", value: "主变高压测" },
    { label: "主变", value: "主变" },
    { label: "传动系统", value: "传动系统" },
    { label: "桨叶系统", value: "桨叶系统" },
    { label: "制动系统", value: "制动系统" },
    { label: "液压系统", value: "液压系统" },
    { label: "偏航系统", value: "偏航系统" },
    { label: "发电系统", value: "发电系统" },
    { label: "风机", value: "风机" },
    { label: "变桨系统", value: "变桨系统" },
  ];
  // 缺陷等级
  defectLevelOption = [
    { label: "一级", value: 0 },
    { label: "二级", value: 1 },
    { label: "三级", value: 2 },
    { label: "四级", value: 3 },
  ];
  // 是否本设备缺陷
  isDeviceDefectOption = [
    { label: "是", value: 1 },
    { label: "否", value: 0 },
  ];

  personOption = [];

  defaultData: {} = {
    motif: [null, [Validators.required, Validators.maxLength(32)]],
    describe: [null, [Validators.required]],
    findTheTime: [null, [Validators.required]],
    quotId: [null, [Validators.required]],
    subEquId: [null, [Validators.required]],
    number: [null, [Validators.required]],
    type: [null, [Validators.required]],
    assignee: [null, [Validators.required]],
    level: [null, [Validators.required]],
    whetherDevice: [null, [Validators.required]],
    remark: [null],
    attachments: [null],
  };
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  attachmentsArr = []; //用来存文件的地址
  // 上传文件
  uploadFileList: Array<NzUploadFile> = [];
  beforeUpload = (file: NzUploadFile): any => {
    if (file.name.length > 100) {
      this.msg.error("文件名长度不能超过100个字符!");
      return false;
    }
    //上传文件的后缀进行判断
    const isType = [""];
    file.name.lastIndexOf(".");
    const fileType = file.name.substring(
      file.name.lastIndexOf("."),
      file.name.length
    ); //从后往前截取文类型
    if (
      fileType == ".rar" ||
      fileType == ".xlsx" ||
      fileType == ".xls" ||
      fileType == ".doc" ||
      fileType == ".docx" ||
      fileType == ".zip" ||
      fileType == ".jpg" ||
      fileType == ".jpeg" ||
      fileType == ".png" ||
      fileType == "bmp"
    ) {
    } else {
      this.msg.error(
        "上传的文件类型应为xls、xlsx、doc、docx、zip、rar、jpg、jpeg、png、bmp！"
      );
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 10;
    if (!isLt2M) {
      this.msg.error("上传的文件不能超过10M！");
      return false;
    }
    this.uploadFileList = [file];
    // return false;
  };
  // 自定义上传方法
  selfUpLoad = (file) => {
    const formData = new FormData();
    formData.append("file", file.file as any);
    formData.append("scene", "flowable");
    formData.append("output", "json");
    formData.append("path", "flowable/");
    formData.append("auth_token", localStorage.getItem("jwt_token"));
    return this.fileManagementService.fileUpload(formData).subscribe(
      (res) => {
        if (res.status === "fail") {
          return this.msg.error("上传失败：" + res.message);
        }
        this.msg.success("上传成功");
        file.onSuccess!(res, file.file!);
      },
      (err) => {
        this.msg.error("上传失败：" + err.message);
        file.onError!(err, file.file!);
      }
    );
  };
  // 自定义删除方法
  removeFile = (file): any => {
    this.fileManagementService.deleteFile({ md5: file.response.md5 }).subscribe(
      (res) => {
        this.msg.success("删除成功");
      },
      (err) => {
        this.msg.error("删除失败：" + err.message);
      }
    );
    return true;
  };

  constructor(
    private fb: FormBuilder,
    private defectManagementService: DefectManagementService,
    private deviceService: DeviceService,
    private fileManagementService: FileManagementService,
    private msg: NzMessageService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group(this.defaultData);
    this.getUserOption();
  }

  getUserOption() {
    this.personOption = [];
    let pageLinkOfUser = new PageLink(1000, 0);
    this.userService.getUsers(pageLinkOfUser).subscribe(
      (res) => {
        if (res) {
          let userList = [];
          res.data.forEach((item) => {
            userList.push({
              label: `${item.firstName || ""}${item.lastName || ""}`,
              value: item.id.id,
            });
          });
          this.personOption = userList;
        }
      },
      (err) => {
        console.log("查找人员err", err);
      }
    );
  }

  handleCancel() {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.uploadFileList = [];
    this.isVisible = false;
    this.handleCancelCb.emit();
  }

  // 抛出去给外部使用的打开方法
  // type: add edit readOnly  approval
  // this.validateForm.controls['username'].setValue('ydd')
  async openDialog(
    type,
    processInstallId?: string,
    url = "/dashboards/cca44360-a039-11ec-9426-03e98d930e1b"
  ) {
    this.url = url;
    this.isVisible = true;
    let currentData = {},
      optionsData: any = {};
    if (processInstallId) {
      const data = await this.defectManagementService
        .getDefectInfo(processInstallId)
        .toPromise();
      currentData = {
        motif: data.motif,
        describe: data.describe,
        findTheTime: data.findTheTime,
        quotId: data.quotId,
        subEquId: data.subEquId,
        number: data.number,
        type: data.type,
        assignee: "",
        level: data.level,
        whetherDevice: data.whetherDevice,
        remark: data.remark || "",
        attachments: data.attachments || [],
      };
      optionsData = {
        person: [
          {
            label: data.quot,
            value: data.quotId,
          },
        ],
        device: [
          {
            label: data.subToTheEqu,
            value: data.subEquId,
          },
        ],
      };
    } else {
      currentData = {
        motif: null,
        describe: null,
        findTheTime: null,
        quotId: null,
        subEquId: null,
        number: null,
        type: null,
        assignee: null,
        level: null,
        whetherDevice: null,
        remark: null,
        attachments: null,
      };
    }

    this.openDialogType = type;
    this.formDisable = type === "readOnly";
    if (this.formDisable) {
      this.deviceOption = optionsData.device || [{}];
    }
    this.validateForm.setValue(currentData);
    for (const key in this.validateForm.controls) {
      this.formDisable
        ? this.validateForm.controls[key].disable()
        : this.validateForm.controls[key].enable();
    }
    this.pageLink.textSearch = "";
    this.cd.detectChanges();
  }

  noHandle(e) {
    e.preventDefault();
  }
  // 缺陷表单提交
  submitForm(value) {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.isSubBtnLoading = true;
    value.linkUrl = location.origin + this.url;
    this.defectManagementService.defectStart(value).subscribe(
      (res) => {
        this.isSubBtnLoading = false;
        this.msg.success(`流程提交成功!`);
        this.handleCancel();
      },
      (err) => {
        console.log("err :>> ", err);
        this.msg.error(err.error.detail);
        this.isSubBtnLoading = false;
      }
    );
  }
  resetForm(e) {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  // 所属设备下拉选择部分
  isLoading = false;
  pageLink = new PageLink(1000, 0);
  hasNext = true;
  searchChange$ = new BehaviorSubject("");

  onDeviceSearch(value: string): void {
    this.isLoading = true;
    this.pageLink.textSearch = value;
    this.pageLink.page = 0;
    this.deviceService
      .getTenantDeviceInfos(this.pageLink, "")
      .subscribe((data) => {
        this.hasNext = data.hasNext;
        if (data.hasNext) {
          this.pageLink.page += 1;
        }
        if (data.data) {
          this.deviceOption = [];
        }
        this.isLoading = false;
        data.data.forEach((item) => {
          this.deviceOption.push({
            label: item.label,
            value: item.id.id,
          });
        });
        this.cd.detectChanges();
      });
  }

  handleUploadChange(info): void {
    // console.log('改变时的回调', info)
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (info.file.status === 'done') {
    //   this.msg.success(`${info.file.name} 上传成功`);
    // } else if (info.file.status === 'error') {
    //   this.msg.error(`${info.file.name} 上传失败`);
    // }
    this.attachmentsArr = [];
    info.fileList.forEach((item) => {
      this.attachmentsArr.push(item.response);
    });
    this.validateForm.controls["attachments"].setValue(this.attachmentsArr);
  }

  stringSplit(path: string): string {
    let strArr = path.split("/");
    return strArr[strArr.length - 1];
  }

  downloadFile(item) {
    let origin =
      process.env.NODE_ENV === "development"
        ? "http://10.0.5.92:30661"
        : window.location.origin;
    // download: 1 = 下载， 0 = 打开
    let itemUrl = `${origin}${item.path}?download=1`;
    window.open(itemUrl, "_self");
  }
}
