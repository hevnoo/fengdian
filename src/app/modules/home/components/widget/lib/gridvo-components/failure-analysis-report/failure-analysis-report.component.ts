import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FailureAnalysisReportService } from '@core/http/failure-analysis-report.service';


// 故障分析报告
@Component({
  selector: 'tb-failure-analysis-report',
  templateUrl: './failure-analysis-report.component.html',
  styleUrls: ['./failure-analysis-report.component.scss']
})
export class FailureAnalysisReportComponent implements OnInit {
  @Input() ctx
  @ViewChild("addReportDialog", { static: true }) addReportDialog: any;
  @ViewChild("approveDialog", { static: true }) approveDialog: any
  searchText: string = ""
  listOfData = []
  pageTotal: number = 0
  pageIndex: number = 0
  pageSize: number = 10


  constructor(
    private failureAnalysisReportService: FailureAnalysisReportService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getReportData()
  }


  getReportData(page?: number) {
    let params = `pageSize=${this.pageSize}&page=${page >= 0 ? page : this.pageIndex}&eventName=${this.searchText}`
    this.failureAnalysisReportService.getFaultList(params).subscribe(res => {
      res.data.sort((a, b) => b.createTime - a.createTime);
      this.listOfData = res.data
      this.pageTotal = res.totalElements
      this.cd.detectChanges();
    }, err => {
      console.log(err)
    })
  }
  openAddModal(type: string, id?: string) {
    if (id) this.addReportDialog.openDialog(type, id, this.ctx.settings.url)
    this.addReportDialog.openDialog(type, undefined, this.ctx.settings.url)

  }

  handleCancelCb() {
    this.getReportData()
  }

  showApproveDialog(id, isFinished) {
    this.approveDialog.openDialog(id, isFinished, "fault_analysis")
  }

  handleApproveCancelCb() {

  }

  returnIndex(i): number {
    if (this.pageIndex === 0) return i + 1
    let currentIndex = (this.pageIndex - 1) * this.pageSize + i + 1
    return currentIndex
  }

}
