import { NzMessageService } from "ng-zorro-antd/message";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DefectManagementService } from "@app/core/http/defect-management.service";
import { DatePipe } from "@angular/common";
import { FailureAnalysisReportService } from "@app/core/http/failure-analysis-report.service";
import { PageLink } from "@app/shared/models/page/page-link";
import { UserService } from "@app/core/http/user.service";
import { NzShowUploadList, NzUploadFile } from "ng-zorro-antd/upload/interface";
import {
  GridvoMobileService,
  CameraType,
} from "@core/services/gridvo-mobile.service";
import { DeviceService } from "@core/http/device.service";
@Component({
  selector: "tb-fd-app-process-work-order",
  templateUrl: "./fd-app-process-work-order.component.html",
  styleUrls: ["./fd-app-process-work-order.component.scss"],
})
export class FdAppProcessWorkOrderComponent implements OnInit {
  @Input() ctx: WidgetContext;
  pageLink = new PageLink(1000, 0);
  buttonText = [
    { value: "processWorkOrder", label: "流程工单" },
    { value: "processLog", label: "流程日志" },
    { value: "flowChart", label: "流转图" },
  ];
  isNeedNextPeople: boolean = true; //缺陷审批是否需要下一执行人
  isNeedDefectApproved: boolean = true; //缺陷审批是否需要展示  “是否同意”(值班员消缺和值长确认消缺不需要)
  isNeedApprovedNextPeople: boolean = true; //故障分析报告是否需要“下一执行人”(故障分析报告和归档两个流程不需要)
  isNeedApproved: boolean = true; //故障分析报告是否需要展示  “是否同意”(故障分析报告和归档两个流程不需要)
  location = location;
  isLoading: boolean = false;
  detailOfTask: any;
  //故障现场照片
  scenePictures: any[] = null;
  // 所属设备下拉选择部分
  deviceOptions: any[] = [];
  deviceName: string;
  userNameKey = {};
  processedPictures: any[] = null;
  approvalOpinions = [
    {
      value: true,
      label: "同意",
    },
    {
      value: false,
      label: "不同意",
    },
  ];
  // info.taskDefinitionKey === "fault_analysis_report"
  isclickText = this.buttonText[0].label;
  processName = "";
  disableComplete: boolean =
    localStorage.getItem("nameOfFromPage") === "default";
  defectOrderFormData: FormGroup;
  falultDetailFormData: FormGroup;
  detailDefect;
  currentIdInfo;
  defectData = [];
  personOption = [];
  page = 0;
  bpmnSrc = "";
  fileList: NzUploadFile[] = [];
  fileListOfScen: NzUploadFile[] = [];
  icons: NzShowUploadList = {
    showPreviewIcon: false,
    showRemoveIcon: false,
    showDownloadIcon: true,
  };
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private defectManagementService: DefectManagementService,
    private failureAnalysisReportService: FailureAnalysisReportService,
    private message: NzMessageService,
    private userService: UserService,
    private GMService: GridvoMobileService,
    private deviceService: DeviceService,
    private ref: ChangeDetectorRef
  ) {}
  public dataChange() {
    console.log(
      this.defectOrderFormData,
      "111 orderform",
      this.falultDetailFormData
    );
  }
  ngOnInit(): void {
    this.ctx.$scope.fdAppProcessWorkOrderWidget = this;
    this.detailOfTask = JSON.parse(localStorage.getItem("clickDefect"));
    this.defectOrderFormData = this.fb.group({
      motif: [null, [Validators.required]],
      quot: [null, [Validators.required]],
      subEqu: [null, [Validators.required]],
      type: [null, [Validators.required]],
      findTheTime: [null],
      number: [null],
      assignee: [null],
      whetherDevice: [null, [Validators.required]],
      remark: [null, [Validators.required]],
      level: [null],
      attachments: [null],
      describe: [null, [Validators.required]],
      message: [null, [Validators.required]],
      approved: ["true"],
      nextPerson: [null],
      isNeedNextPerson: [null],
    });
    this.falultDetailFormData = this.fb.group({
      eventName: [null],
      number: [null],
      major: [null],
      device: [null],
      happened: [null],
      beginTime: [null],
      endTime: [null],
      reason: [null],
      handle: [null],
      department: [null],
      exposedProblem: [null],
      measures: [null],
      personInCharge: [null],
      assignee: [null],
      approved: ["true"],
      message: [null],
      nextPerson: [null],
    });
    this.goToDetail();
    this.getUserOption();
  }
  onDeviceSearch(value: string): void {
    this.isLoading = true;
    let hasNext = false;
    this.pageLink.textSearch = value;
    this.pageLink.page = 0;
    this.deviceService
      .getTenantDeviceInfos(this.pageLink, "")
      .subscribe((data) => {
        hasNext = data.hasNext;
        if (hasNext) {
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
        this.ctx.detectChanges();
      });
  }
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
  submitForm() {
    if (this.processName === "缺陷上报") {
      if (
        !this.defectOrderFormData.value.message ||
        this.defectOrderFormData.value.message.length === 0
      ) {
        this.message.error("意见必须输入");
        return;
      } else if (
        ((this.isNeedNextPeople &&
          !this.disableComplete &&
          this.defectOrderFormData.value.approved === "true") ||
          this.detailOfTask.taskDefinitionKey === "usertask2") &&
        !this.defectOrderFormData.value.nextPerson
      ) {
        this.message.error("下一操作人必填");
        return;
      }
      this.submitApproveForm(this.defectOrderFormData.value);
    } else if (this.processName === "故障分析") {
      if (
        !this.falultDetailFormData.value.message ||
        this.falultDetailFormData.value.message.length === 0
      ) {
        this.message.error("意见必须输入");
        return;
      } else if (
        !this.falultDetailFormData.value.nextPerson &&
        this.isNeedApprovedNextPeople &&
        !this.disableComplete &&
        this.falultDetailFormData.value.approved === "true"
      ) {
        this.message.error("下一操作人必填");
        return;
      }
      this.submitReportForm(this.falultDetailFormData.value);
    }
  }
  // 缺陷管理-提交审批
  submitApproveForm(value) {
    let url = localStorage.getItem("fromPageUrl");
    let params = {
      taskId: this.detailOfTask.id,
      processInstanceId: this.detailOfTask.processInstanceDO.id,
      message: value.message,
      type: value.approved === "true" ? "SP" : "BH",
      variables: {
        approved: value.approved === "true",
        assignee: value.nextPerson || "",
      },
    };
    this.defectManagementService.taskComplete(params).subscribe(
      (res) => {
        this.message.success(`流程审批成功!`);
        this.goBack();
      },
      (err) => {
        console.log(err, "审批错误");
        this.message.error(err.error.detail);
      }
    );
  }
  //拍照
  getPhoto(num?: number) {
    const subjection = this.GMService.openCamera(
      CameraType.takePhotos
    ).subscribe({
      next: (res) => {
        if (num === 0 && this.scenePictures) {
          this.scenePictures.push({ path: location.origin + res.data });
        } else if (num === 0) {
          this.scenePictures = [{ path: location.origin + res.data }];
        } else if (!this.processedPictures) {
          this.processedPictures = [{ path: location.origin + res.data }];
        } else {
          this.processedPictures.push({ path: location.origin + res.data });
        }
      },
      error: (err) => {
        this.message.error(err.message);
      },
      complete: () => {
        subjection?.unsubscribe();
      },
    });
  }
  // 故障分析报告-提交审批
  submitReportForm(value) {
    if (this.detailOfTask.taskDefinitionKey === "fault_analysis_report") {
      this.falultDetailFormData
        .get("beginTime")
        .setValue(
          new Date(this.falultDetailFormData.value.beginTime).getTime()
        );
      this.falultDetailFormData
        .get("endTime")
        .setValue(new Date(this.falultDetailFormData.value.endTime).getTime());
      let params = {
        id: this.currentIdInfo.id,
        taskId: this.detailOfTask.id,
        procInstId: this.detailOfTask.processInstanceId,
        message: value.message,
        type: "SP",
        scenePictures: this.scenePictures,
        processedPictures: this.processedPictures,
        assignee: "",
      };
      params = Object.assign(params, this.falultDetailFormData.value);
      params.assignee = value.nextPerson;
      if (!value.message || value.message.length === 0) {
        this.message.error("意见必须输入");
      } else {
        this.failureAnalysisReportService.faultComplete(params).subscribe(
          (res) => {
            this.message.success("审批提交成功！");
            this.goBack();
          },
          (err) => {
            console.log("err :>> ", err);
            this.message.error(err.error.detail);
          }
        );
      }
    } else {
      let params = {
        taskId: this.detailOfTask.id,
        processInstanceId: this.detailOfTask.processInstanceDO.id,
        message: value.message,
        type: value.approved === "true" ? "SP" : "BH", //同意-审批  不同意-驳回
        variables: {
          act_rollback: value.approved !== "true", //这个值 true 表示驳回 不需要下一审批人  ；false 表示审批同意
          assignee: value.approved === "true" ? value.nextPerson : "",
        },
      };
      if (!value.message || value.message.length === 0) {
        this.message.error("意见必须输入");
      } else {
        this.failureAnalysisReportService.taskComplete(params).subscribe(
          (res) => {
            this.message.success("审批提交成功！");
            this.goBack();
          },
          (err) => {
            console.log(err);
            this.message.error(err.error.detail);
          }
        );
      }
    }
  }
  goBack() {
    let id = localStorage.getItem("nameOfFromPage");
    let params = {
      entityId: this.ctx.datasources?.[0].entity.id,
      entityName: this.ctx.datasources?.[0].entityName,
    };
    //回退
    this.ctx.stateController.updateState(id, params, false);
  }
  public paramsToQuery(params): string {
    let query = `pageSize=${params.pageSize}&page=${params.page}`;
    return query;
  }
  // 查找人员列表
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
        this.message.error(err.error.detail);
      }
    );
  }
  async changeText(text: string) {
    this.isclickText = text;
    let id = JSON.parse(localStorage.getItem("clickDefect")).processInstanceDO
      .id;
    let currentBpmnKey =
      this.detailOfTask.processInstanceDO.processDefinitionId.indexOf(
        "fault_analysis"
      ) > -1
        ? "fault_analysis"
        : "defect";
    if (text === this.buttonText[2].label) {
      let bpmnRes;
      let isFinished = this.detailOfTask.processInstanceDO.endTime
        ? true
        : false;
      if (isFinished) {
        bpmnRes = await this.defectManagementService
          .getRunTimeBpmnFile(currentBpmnKey)
          .toPromise();
      } else {
        bpmnRes = await this.defectManagementService
          .getBpmnFile(id)
          .toPromise();
      }
      this.bpmnSrc = `data:image/jpg;base64,${
        bpmnRes.diagram || bpmnRes.definedDiagram
      }`;
      this.ctx.detectChanges();
    } else if (text === this.buttonText[1].label) {
      let tableRes = await this.defectManagementService
        .getHistoricTask(id)
        .toPromise();
      this.defectData = tableRes.tasks ? tableRes.tasks : [];
      this.defectData.map((item) => {
        tableRes.comments.forEach((_i) => {
          if (item.id === _i.taskId) {
            item.comments = _i;
          }
        });
      });
      tableRes.users &&
        tableRes.users.forEach((item) => {
          if (item) {
            this.userNameKey[item.id.id] = item.firstName;
          }
        });
      this.ctx.detectChanges();
    }
  }

  async goToDetail() {
    //给表单定义值并且让其中三个不可输入
    let detail;
    console.log(this.detailOfTask);
    this.processName = this.detailOfTask.processInstanceDO.name;
    this.isNeedNextPeople =
      this.detailOfTask.taskDefinitionKey !== "usertask3" ? true : false;
    this.isNeedDefectApproved =
      this.detailOfTask.taskDefinitionKey !== "usertask3" &&
      this.detailOfTask.taskDefinitionKey !== "usertask2"
        ? true
        : false;
    this.isNeedApprovedNextPeople =
      this.detailOfTask.taskDefinitionKey !== "archive" ? true : false;
    this.isNeedApproved =
      this.detailOfTask.taskDefinitionKey !== "archive" &&
      this.detailOfTask.taskDefinitionKey !== "fault_analysis_report"
        ? true
        : false;
    if (this.detailOfTask.processInstanceDO.name === "缺陷上报") {
      detail = await this.defectManagementService
        .getDefectInfo(
          this.detailOfTask.processInstanceId ||
            this.detailOfTask.processInstanceDO.id
        )
        .toPromise();
      this.currentIdInfo = detail;
      let level = {
        "0": "一级",
        "1": "二级",
        "2": "三级",
        "3": "四级",
      };
      let currentData = {
        motif: detail.motif,
        quot: detail.quot,
        subEqu: detail.subToTheEqu || "",
        type: detail.type,
        assignee: "",
        whetherDevice: detail.whetherDevice === "0" ? "是" : "否",
        findTheTime: this.datePipe.transform(
          detail.findTheTime,
          "yyyy-MM-dd HH:mm:ss"
        ),
        remark: detail.remark || null,
        attachments: detail.attachments || [],
        number: detail.number,
        level: level[detail.level],
        describe: detail.describe,
        isNeedNextPerson: null,
        message: null,
        approved: "true",
        nextPerson: null,
      };
      this.defectOrderFormData.setValue(currentData);
      this.ref.markForCheck();
      for (const key in this.defectOrderFormData.controls) {
        if (
          key !== "approved" &&
          key !== "message" &&
          key !== "nextPerson" &&
          key !== "isNeedNextPerson" &&
          key !== "attachments"
        )
          this.defectOrderFormData.controls[key].disable();
      }
    } else if (this.detailOfTask.processInstanceDO.name === "故障分析") {
      detail = await this.failureAnalysisReportService
        .getFaultInfo(
          this.detailOfTask.processInstanceId ||
            this.detailOfTask.processInstanceDO.id
        )
        .toPromise();
      this.currentIdInfo = detail;
      let deviceId = {
        id: detail.device.id,
      };
      this.deviceName = detail.device.name;
      let currentData = {
        eventName: detail.eventName,
        number: detail.number,
        major: detail.major,
        device: deviceId,
        happened: detail.happened,
        beginTime: this.datePipe.transform(
          detail.beginTime,
          "yyyy-MM-dd HH:mm:ss"
        ),
        department: detail.department,
        endTime: this.datePipe.transform(detail.endTime, "yyyy-MM-dd HH:mm:ss"),
        reason: detail.reason,
        handle: detail.handle,
        exposedProblem: detail.exposedProblem,
        measures: detail.measures,
        personInCharge: detail.personInCharge,
        assignee: detail.assignee || null,
        approved: detail.approved || "true",
        message: detail.message || null,
        nextPerson: detail.nextPerson || null,
      };
      let origin =
        process.env.NODE_ENV === "development"
          ? "http://10.0.5.92:30661"
          : window.location.origin;
      let data1 = [];
      detail.processedPictures.forEach((item) => {
        data1.push({
          uid: item.md5,
          name: item.path,
          status: "done",
          url: `${origin}${item.path}?height=100&with=100`,
          response: item,
        });
      });
      this.fileList = data1;
      let data2 = [];
      detail.scenePictures.forEach((item) => {
        data2.push({
          uid: item.md5,
          name: item.path,
          status: "done",
          url: `${origin}${item.path}?height=100&with=100`,
          response: item,
        });
      });
      this.deviceOptions = [
        { label: detail.device.name || "", value: deviceId || "" },
      ];
      this.fileListOfScen = data2;
      this.falultDetailFormData.setValue(currentData);
      // 故障分析报告阶段审批驳回，需要重新填写表单
      if (this.detailOfTask.taskDefinitionKey !== "fault_analysis_report") {
        for (const key in this.falultDetailFormData.controls) {
          if (key !== "approved" && key !== "message" && key !== "nextPerson")
            this.falultDetailFormData.controls[key].disable();
        }
      }
      this.ctx.detectChanges();
    }
    //使得每一个输入框都不可点击
  }

  stringSplit(path: string): string {
    let strArr = path.split("/");
    return strArr[strArr.length - 1];
  }
}
