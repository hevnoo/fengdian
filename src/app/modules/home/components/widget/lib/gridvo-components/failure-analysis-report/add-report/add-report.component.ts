import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzUploadFile, NzShowUploadList } from "ng-zorro-antd/upload";
import { PageLink } from "@shared/models/page/page-link";
import { BehaviorSubject, Observable } from "rxjs";
import { DeviceService } from "@core/http/device.service";
import { FileManagementService } from "@app/core/http/file-management.service";
import { FailureAnalysisReportService } from "@core/http/failure-analysis-report.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { UserService } from "@core/http/user.service";
import { differenceInCalendarDays } from "date-fns";

@Component({
  selector: "tb-add-report",
  templateUrl: "./add-report.component.html",
  styleUrls: ["./add-report.component.scss"],
})
export class AddReportComponent implements OnInit {
  @Output() handleCancelCb = new EventEmitter(); //弹窗关闭的回调
  validateForm!: FormGroup;
  isVisible: boolean = false;
  isSubBtnLoading: boolean = false;
  openDialogType: string = "add"; //"add"  "readOnly" ""
  reportFormData: {} = {
    eventName: [null, [Validators.required, Validators.maxLength(32)]], //主题
    number: [null, [Validators.required, Validators.maxLength(32)]], //工单号
    major: [null, [Validators.required, Validators.maxLength(32)]], //专业
    device: [null, [Validators.required]], //设备
    happened: [null, [Validators.required, Validators.maxLength(100)]], //事情经过
    beginTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    scenePictures: [null], //现场照片
    reason: [null, [Validators.required, Validators.maxLength(100)]], //原因分析
    handle: [null, [Validators.required, Validators.maxLength(100)]], //处理方式
    processedPictures: [null, [Validators.required]], //处理后照片
    exposedProblem: [], //暴露问题
    measures: [null, [Validators.required, Validators.maxLength(100)]], //防范措施
    department: [null, [Validators.required, Validators.maxLength(32)]], //防范责任部门
    personInCharge: [null, [Validators.required, Validators.maxLength(32)]], //防范责任人
    assignee: [null, [Validators.required]], //
    // rewards: []//奖惩意见-提交表单时没有这个值
  };
  detailId: string = "";

  icons: NzShowUploadList = {
    showPreviewIcon: false,
    showRemoveIcon: true,
    showDownloadIcon: true,
  };

  // 故障现场照片
  fileList: NzUploadFile[] = [];
  // 处理后照片
  afterFileList: NzUploadFile[] = [];

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private cd: ChangeDetectorRef,
    private failureAnalysisReportService: FailureAnalysisReportService,
    private fileManagementService: FileManagementService,
    private msg: NzMessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group(this.reportFormData);
    this.getUserOption();
  }

  // 所属设备下拉选择部分
  deviceOptions: any[] = [];
  personOption: any[] = [];
  isLoading = false;
  pageLink = new PageLink(1000, 0);
  hasNext = true;
  searchChange$ = new BehaviorSubject("");
  url: string;
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
          this.deviceOptions = [];
        }
        this.isLoading = false;
        data.data.forEach((item) => {
          this.deviceOptions.push({
            label: item.label,
            value: {
              id: item.id,
            },
          });
        });
        this.cd.detectChanges();
      });
  }

  handleCancel() {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.fileList = [];
    this.afterFileList = [];
    this.isVisible = false;
    this.handleCancelCb.emit();
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  submitForm(value) {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    value.linkUrl = `${location.origin}${this.url}`;
    this.isSubBtnLoading = true;
    if (
      new Date(value.beginTime).getTime() - new Date(value.endTime).getTime() >
      0
    ) {
      this.msg.info("结束时间不可早于开始时间");
      this.isSubBtnLoading = false;
      return;
    }
    this.failureAnalysisReportService.faultStart(value).subscribe(
      (res) => {
        this.isSubBtnLoading = false;
        this.msg.success("提交成功！");
        this.handleCancel();
      },
      (err) => {
        console.log("err :>> ", err);
        this.isSubBtnLoading = false;
      }
    );
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

  // 上传文件 ----0309不知道怎么传参数 所以先分开写  后续看看如何改进
  beforeUpload = (file: NzUploadFile, type?: number): any => {
    this.fileList = [file];
  };
  beforeUpload2 = (file: NzUploadFile, type?: number): any => {
    this.afterFileList = [file];
  };
  // 自定义上传方法
  selfUpLoad = (file) => {
    const formData = new FormData();
    formData.append("file", file.file as any);
    formData.append("scene", "flowable");
    formData.append("output", "json");
    formData.append("path", "");
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

  // 上传列表改变的回调
  handleUploadChange(info, type: string): void {
    // console.log('改变时的回调', type, info)
    let picData = [];
    info.fileList.forEach((item) => {
      picData.push(item.response);
    });
    this.validateForm.controls[type].setValue(picData);
  }

  // 获取错误内容
  getVaErr(e) {
    console.log(e);
  }

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

  // 自定义下载方法
  downloadFile = (file): any => {
    let origin =
      process.env.NODE_ENV === "development"
        ? "http://10.0.5.92:30661"
        : window.location.origin;
    // download: 1 = 下载， 0 = 打开
    let itemUrl = `${origin}${file.response.path}?download=1`;
    window.open(itemUrl, "_self");
  };

  // 打开弹窗 填充数据
  async openDialog(
    type,
    processInstallId?: string,
    url: string = "/dashboards/cca44360-a039-11ec-9426-03e98d930e1b",
    taskDefinitionKey?: string
  ) {
    // console.log('打开弹窗的type111111111 :>> ', type);
    this.url = url;
    this.isVisible = true;
    this.openDialogType = type;
    this.icons.showRemoveIcon =
      this.openDialogType !== "readOnly" ? true : false;
    let currentData = {};
    if (processInstallId) {
      const data = await this.failureAnalysisReportService
        .getFaultInfo(processInstallId)
        .toPromise();
      let deviceId = {
        id: data.device.id,
      };
      currentData = {
        eventName: data.eventName,
        number: data.number, //工单号
        major: data.major, //专业
        device: deviceId || "", //设备
        happened: data.happened, //事情经过
        beginTime: data.beginTime,
        endTime: data.endTime,
        scenePictures: data.scenePictures, //现场照片
        reason: data.reason, //原因分析
        handle: data.handle, //处理方式
        processedPictures: data.processedPictures, //处理后照片
        exposedProblem: data.exposedProblem || "", //暴露问题
        measures: data.measures, //防范措施
        department: data.department, //防范责任部门
        personInCharge: data.personInCharge, //防范责任人
        assignee: "",
      };
      this.detailId = data.id;
      this.deviceOptions = [
        { label: data.device.label || "", value: deviceId || "" },
      ];
      let origin =
        process.env.NODE_ENV === "development"
          ? "http://10.0.5.92:30661"
          : window.location.origin;
      let data1 = [],
        data2 = [];
      data.processedPictures.forEach((item) => {
        data1.push({
          uid: item.md5,
          name: item.path,
          status: "done",
          url: `${origin}${item.path}?height=100&with=100`,
          response: item,
        });
      });
      data.scenePictures.forEach((item) => {
        data2.push({
          uid: item.md5,
          name: item.path,
          status: "done",
          url: `${origin}${item.path}?height=100&with=100`,
          response: item,
        });
      });
      this.afterFileList = data1;
      this.fileList = data2;
    } else {
      currentData = {
        eventName: "",
        number: "", //工单号
        major: "", //专业
        device: "", //设备
        happened: "", //事情经过
        beginTime: "",
        endTime: "",
        scenePictures: [], //现场照片
        reason: "", //原因分析
        handle: "", //处理方式
        processedPictures: [], //处理后照片
        exposedProblem: "" || "", //暴露问题
        measures: "", //防范措施
        department: "", //防范责任部门
        personInCharge: "", //防范责任人
        assignee: "",
      };
    }
    this.validateForm.setValue(currentData);
    for (const key in this.validateForm.controls) {
      this.openDialogType === "readOnly"
        ? this.validateForm.controls[key].disable()
        : this.validateForm.controls[key].enable();
    }
  }
}
