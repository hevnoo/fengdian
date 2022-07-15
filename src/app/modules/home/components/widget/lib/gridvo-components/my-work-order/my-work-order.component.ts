import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "@core/http/user.service";
import { PageLink } from "@shared/models/page/page-link";
import { DefectManagementService } from "@core/http/defect-management.service";
import { WidgetContext } from "@home/models/widget-component.models";
import { WidgetConfig } from "@shared/models/widget.models";
import { isDefined } from "@core/utils";
import { AuthState } from "@core/auth/auth.models";
import { getCurrentAuthState } from "@core/auth/auth.selectors";
import { Store } from "@ngrx/store";
import { AppState } from "@core/core.state";
import { NzMessageService } from "ng-zorro-antd/message";
import { FailureAnalysisReportService } from "@core/http/failure-analysis-report.service";

interface searchParamsData {
  processNum: string | number;
  processName: string;
  motif: string;
  [propname: string]: any;
}
enum pageType {
  MY_WORK_ORDER = "0", //我的任务
  My_STARTED = "1", //我发起的
  ORDER_QUERY = "2", //工单查询
}

@Component({
  selector: "tb-my-work-order",
  templateUrl: "./my-work-order.component.html",
  styleUrls: ["./my-work-order.component.scss"],
})
export class MyWorkOrderComponent implements OnInit {
  authState: AuthState = getCurrentAuthState(this.store);
  @Input() ctx: WidgetContext; //由于需要从配置项中取出当前是哪个页面 故需要传入ctx
  public widgetConfig: WidgetConfig;
  @ViewChild("childDialog", { static: true }) childDialog: any;
  @ViewChild("approveDialog", { static: true }) approveDialog: any;
  @ViewChild("addReportDialog", { static: true }) addReportDialog: any;
  public isApply: boolean = false; //缺陷管理的弹窗是否需要审批流程
  public isReportApply: boolean = false; //故障分析的弹窗是否需要审批流程
  isSubBtnLoading: boolean = false;
  public searchParams: searchParamsData = {
    processNum: "", //流程编号
    processName: "",
    motif: "",
    page: 0,
    pageSize: 10,
  };
  // 分页
  pageTotal: number = 100;
  pageIndex: number = 1;
  paramsOfStartUserId = "";
  listOfData = [];
  approvalFormObj!: FormGroup; //缺陷管理
  reportFormObj!: FormGroup; //故障分析
  commonOpinionTextOption = [
    { label: "同意", value: true },
    { label: "不同意", value: false },
  ];

  personOption = [];

  isNeedNextPeople: string = ""; //缺陷审批是否需要下一执行人
  isNeedDefectApproved: boolean = true; //缺陷审批是否需要展示  “是否同意”(值班员消缺和值长确认消缺不需要)
  isNeedApprovedNextPeople: boolean = true; //故障分析报告是否需要“下一执行人”(故障分析报告和归档两个流程不需要)
  isNeedApproved: boolean = true; //故障分析报告是否需要展示  “是否同意”(故障分析报告和归档两个流程不需要)

  pageModel: string; // 0我的任务 1我发起的 2工单查询
  currentIdInfo = {
    id: "",
    taskId: "",
    processInstanceId: "",
    taskDefinitionKey: "",
  };

  constructor(
    protected store: Store<AppState>,
    private fb: FormBuilder,
    private userService: UserService,
    private defectManagementService: DefectManagementService,
    private cd: ChangeDetectorRef,
    private msg: NzMessageService,
    private failureAnalysisReportService: FailureAnalysisReportService
  ) {}

  ngOnInit(): void {
    this.widgetConfig = this.ctx.widgetConfig;
    this.pageModel = isDefined(this.widgetConfig.settings.pageModel)
      ? this.widgetConfig.settings.pageModel
      : pageType.MY_WORK_ORDER;
    this.approvalFormObj = this.fb.group({
      approved: [true],
      message: [null],
      isNeedNextPerson: [false],
      nextPerson: [null],
    });
    this.reportFormObj = this.fb.group({
      approved: [true],
      message: [null],
      nextPerson: [null],
    });

    if (this.pageModel !== "1") this.getUserOption();
    this.getWorkOrderList(1);
  }

  getWorkOrderList(currentPageIndex?: number) {
    if (currentPageIndex) this.pageIndex = currentPageIndex;
    this.searchParams.page = this.pageIndex - 1;
    this.listOfData = [];
    if (this.pageModel === pageType.MY_WORK_ORDER) {
      console.log(this.searchParams);
      this.searchParams.userIds = this.authState.authUser.userId;
      this.defectManagementService
        .getToDoWorkOrderList(this.paramsToQuery(this.searchParams))
        .subscribe(
          (res) => {
            console.log(res);
            if (res) {
              res.data.sort((a, b) => b.createTime - a.createTime);
              this.listOfData = res.data;
              this.pageTotal = res.totalElements;
              this.cd.detectChanges();
            }
          },
          (err) => {
            console.log("查询工单err", err);
            this.msg.error(err.error.detail);
          }
        );
    } else {
      this.searchParams.startUserId =
        this.pageModel === pageType.My_STARTED
          ? this.authState.authUser.userId
          : this.paramsOfStartUserId;
      this.defectManagementService
        .getMyOrderList(this.paramsToQuery(this.searchParams))
        .subscribe(
          (res) => {
            if (res) {
              res.data.sort((a, b) => b.createTime - a.createTime);
              this.listOfData = res.data;
              this.pageTotal = res.totalElements;
              this.cd.detectChanges();
            }
          },
          (err) => {
            console.log("查询工单err", err);
            this.msg.error(err.error.detail);
          }
        );
    }
  }

  public paramsToQuery(params): string {
    let query = `pageSize=${params.pageSize}&page=${params.page}&processNum=${
      params.processNum
    }&processName=${encodeURIComponent(
      params.processName ?? ""
    )}&motif=${encodeURIComponent(params.motif)}`;
    if (params.startUserId) {
      query += `&startUserId=${params.startUserId}`;
    }
    if (params.userIds) {
      query += `&userIds=${params.userIds}`;
    }
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
        this.msg.error(err.error.detail);
      }
    );
  }

  async showFlowDiaHandle(isNeedFlow, info) {
    this.isApply = isNeedFlow; //是否是办理
    // 初始化故障分析表单
    this.reportFormObj.setValue({
      approved: true,
      message: null,
      nextPerson: null,
    });
    this.currentIdInfo = {
      id: "", //单条数据详情接口返回的 id 字段
      taskId: info.id || "", //列表数据里返回的  id字段
      processInstanceId: info.processInstanceDO.id, //列表数据里返回的 processInstanceDO.id
      taskDefinitionKey: info.taskDefinitionKey || "",
    };
    this.isNeedApprovedNextPeople =
      info.taskDefinitionKey !== "archive" ? true : false;
    this.isNeedApproved =
      info.taskDefinitionKey !== "archive" &&
      info.taskDefinitionKey !== "fault_analysis_report"
        ? true
        : false;
    this.isNeedNextPeople = info.taskDefinitionKey;
    this.isNeedDefectApproved =
      info.taskDefinitionKey !== "usertask3" &&
      info.taskDefinitionKey !== "usertask2"
        ? true
        : false;
    // 缺陷管理逻辑
    if (info.processInstanceDO.processDefinitionId.includes("defect")) {
      this.childDialog.openDialog("readOnly", info.processInstanceDO.id);
    }
    // 故障分析逻辑
    if (info.processInstanceDO.processDefinitionId.includes("fault_analysis")) {
      if (info.taskDefinitionKey === "fault_analysis_report" && isNeedFlow) {
        //处在故障分析报告流程 需要重新填写表单
        this.addReportDialog.openDialog("rewrite", info.processInstanceDO.id);
      } else {
        this.addReportDialog.openDialog("readOnly", info.processInstanceDO.id);
      }
    }
  }

  // 工单详情的弹窗关闭
  handleCancelCb(formName) {
    this[formName].reset();
    for (const key in this[formName].controls) {
      this[formName].controls[key].markAsPristine();
      this[formName].controls[key].updateValueAndValidity();
    }
  }

  // 审批进度弹窗关闭
  handleApproveCancelCb() {
    this.reportFormObj.setValue({
      approved: true,
      message: null,
      nextPerson: null,
    });
  }

  showApproveDialog(processInstanceDO, isFinished) {
    let currentBpmnKey =
      processInstanceDO.processDefinitionId.indexOf("fault_analysis") > -1
        ? "fault_analysis"
        : "defect";
    this.approveDialog.openDialog(
      processInstanceDO.id,
      isFinished,
      currentBpmnKey
    );
  }

  // 缺陷管理-提交审批
  submitApproveForm(value) {
    if (
      !value.nextPerson &&
      this.isNeedNextPeople !== "usertask3" &&
      value.approved
    ) {
      return this.msg.info("请指定下一步操作人在提交");
    }
    let params = {
      taskId: this.currentIdInfo.taskId,
      processInstanceId: this.currentIdInfo.processInstanceId,
      message: value.message,
      type: value.approved === false ? "BH" : "SP",
      variables: {
        approved: value.approved,
        assignee: value.nextPerson || "",
      },
    };
    this.isSubBtnLoading = true;
    this.defectManagementService.taskComplete(params).subscribe(
      (res) => {
        this.isSubBtnLoading = false;
        this.msg.success(`流程审批成功!`);
        this.childDialog.isVisible = false;
        this.handleCancelCb("approvalFormObj");
        this.getWorkOrderList(1);
      },
      (err) => {
        console.log(err);
        this.isSubBtnLoading = false;
        this.msg.error(err.error.detail);
      }
    );
  }

  // 故障分析报告-提交审批
  submitReportForm(value) {
    this.isSubBtnLoading = true;
    if (this.currentIdInfo.taskDefinitionKey === "fault_analysis_report") {
      let params = {
        id: this.addReportDialog.detailId,
        taskId: this.currentIdInfo.taskId,
        procInstId: this.currentIdInfo.processInstanceId,
        message: value.message,
        type: "SP",
        assignee: "",
      };
      params = Object.assign(params, this.addReportDialog.validateForm.value);
      params.assignee = value.nextPerson;
      this.failureAnalysisReportService.faultComplete(params).subscribe(
        (res) => {
          this.isSubBtnLoading = false;
          this.msg.success("审批提交成功！");
          this.addReportDialog.isVisible = false;
          this.handleCancelCb("reportFormObj");
          this.getWorkOrderList(1);
          // this.handleApproveCancelCb();
        },
        (err) => {
          console.log("err :>> ", err);
          this.isSubBtnLoading = false;
          this.msg.error(err.error.detail);
        }
      );
    } else {
      let params = {
        taskId: this.currentIdInfo.taskId,
        processInstanceId: this.currentIdInfo.processInstanceId,
        message: value.message,
        type: value.approved ? "SP" : "BH", //同意-审批  不同意-驳回
        variables: {
          act_rollback: !value.approved, //这个值 true 表示驳回 不需要下一审批人  ；false 表示审批同意
          assignee: value.approved ? value.nextPerson : "",
        },
      };
      this.failureAnalysisReportService.taskComplete(params).subscribe(
        (res) => {
          this.isSubBtnLoading = false;
          this.msg.success("审批提交成功！");
          this.addReportDialog.isVisible = false;
          this.handleCancelCb("reportFormObj");
          this.getWorkOrderList(1);
        },
        (err) => {
          console.log(err);
          this.isSubBtnLoading = false;
          this.msg.error(err.error.detail);
        }
      );
    }
  }
}
