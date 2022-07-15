import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { DefectManagementService } from "@core/http/defect-management.service";
interface searchParamsData {
  describeText: string;
  time: Date[];
  describeGrade: number;
  [propname: string]: any;
}

@Component({
  selector: "tb-defect-management",
  templateUrl: "./defect-management.component.html",
  styleUrls: ["./defect-management.component.scss"],
})
export class DefectManagementComponent implements OnInit {
  @Input() ctx;
  @ViewChild("childDialog", { static: true }) childDialog: any;
  @ViewChild("approveDialog", { static: true }) approveDialog: any;
  public searchParams = {
    describe: "", //缺陷描述
    time: [],
    // level: null, //缺陷等级
    level: ""
  };
  public ranges: object = {
    今天: [new Date(new Date().toLocaleDateString()).getTime(), new Date()],
  };
  listOfData = [];
  // 分页
  pageTotal: number = 100;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private modal: NzModalService,
    private defectManagementService: DefectManagementService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchDefectHandle(1);
  }

  initDefectList(params) {
    this.defectManagementService.getDefectList(params).subscribe(
      (res) => {
        if (res) {
          res.data.sort(
            (a, b) =>
              b.historicProcessInstance.startTime -
              a.historicProcessInstance.startTime
          );
          this.listOfData = res.data;
          this.pageTotal = res.totalElements;
          this.cd.detectChanges();
        }
      },
      (err) => {
        console.log("请求列表err :>> ", err);
      }
    );
  }

  searchDefectHandle(currentPageIndex?: number) {
    if (currentPageIndex) this.pageIndex = currentPageIndex;
    let params = {
      motif: this.searchParams.describe,
      startTime: this.searchParams.time[0]
        ? this.getymd(this.searchParams.time[0], false)
        : "",
      endTime: this.searchParams.time[1]
        ? this.getymd(this.searchParams.time[1], true)
        : "",
      level: this.searchParams.level || "",
      page: this.pageIndex - 1,
      pageSize: this.pageSize,
    };
    this.initDefectList(this.paramsToQuery(params));
  }

  public paramsToQuery(params): string {
    let query = `pageSize=${params.pageSize}&page=${params.page}&level=${params.level
      }&startTime=${params.startTime}&endTime=${params.endTime
      }&motif=${encodeURIComponent(params.motif)}`;
    return query;
  }

  getymd(dateStr, isEnd) {
    let d = new Date(dateStr);
    let resDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}${
      isEnd ? " 23:59:59" : " 00:00:00"
    }`;
    return resDate;
  }

  // 打开弹窗
  async showAddDialogHandle(type, processInstallId) {
    this.childDialog.openDialog(type, processInstallId, this.ctx.settings.url);
  }

  submitFlowHandle() {
    this.modal.confirm({
      nzTitle: "<i>提示</i>",
      nzContent: "<b>确认提交该流程吗？</b>",
      nzOnOk: () => console.log("OK"),
    });
  }

  handleCancelCb() {
    this.searchDefectHandle(1);
  }
  handleApproveCancelCb() {
    this.searchDefectHandle(1);
  }

  showApproveDialog(id, isFinished) {
    this.approveDialog.openDialog(id, isFinished, "defect");
  }
}
