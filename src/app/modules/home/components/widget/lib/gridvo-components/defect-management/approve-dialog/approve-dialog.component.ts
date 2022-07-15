import { Component, Input, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { DefectManagementService } from '@core/http/defect-management.service';

@Component({
  selector: 'tb-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.scss']
})
export class ApproveDialogComponent implements OnInit {
  @Input() isApproveVisible: boolean = false
  @Output() handleApproveCancel = new EventEmitter()  //弹窗关闭的回调

  listOfData = []

  constructor(private defectManagementService: DefectManagementService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
  }

  handleCancel() {
    this.isApproveVisible = false
    this.bpmnSrc = ""
    this.listOfData = []
    this.handleApproveCancel.emit()
  }

  userNameKey = {}
  bpmnSrc = ""
  async openDialog(id, isFinished,bpmnKey) {
    this.isApproveVisible = true
    let bpmnRes
    if (isFinished) {
      bpmnRes = await this.defectManagementService.getRunTimeBpmnFile(bpmnKey).toPromise()
    } else {
      bpmnRes = await this.defectManagementService.getBpmnFile(id).toPromise()
    }
    let tableRes = await this.defectManagementService.getHistoricTask(id).toPromise()
    this.listOfData = tableRes.tasks
    this.listOfData.map(item => {
      tableRes.comments.forEach(_i => {
        if (item.id === _i.taskId) {
          item.comments = _i
        }
      })
    })
    tableRes.users && tableRes.users.forEach(item => {
      if (item) {
        this.userNameKey[item.id.id] = item.firstName
      }
    });
    this.bpmnSrc = `data:image/jpg;base64,${bpmnRes.diagram || bpmnRes.definedDiagram}`
    this.cd.detectChanges();
  }

}
