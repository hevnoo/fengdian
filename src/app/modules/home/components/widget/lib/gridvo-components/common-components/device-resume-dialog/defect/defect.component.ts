import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';
import { DefectManagementService } from '@app/core/http/public-api';
import { WidgetContext } from '@home/models/widget-component.models';
import * as device from '../device-resume-dialog.module'
@Component({
  selector: 'tb-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.scss']
})
export class DefectComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Input() deviceId: string;

  public defectList = []
  public defectTheadData
  public total
  defectLevelMap = new Map<number, string>()
  .set(0, '一级')
  .set(1, '二级')
  .set(2, '三级')
  .set(3, '四级')

  pagetion = {
    page: 1,
    pageSize: 10,
    total: 0
  }

  constructor(private defectManagementService: DefectManagementService, private datePipe: DatePipe, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.defectTheadData = device.defectThead
    this.getNewData(this.pagetion)
  }

  getNewData(e) {
    let _this = this
    let query = `page=${e.page-1}&pageSize=${e.pageSize}`
    this.defectManagementService.getDefectList(query).subscribe(res => {
      console.log('defect',res);
      let arr = []
      res.data.forEach(item => {
        let val = {
          defectNumber: item?.number,
          discoveryTime: _this.datePipe.transform(item?.findTheTime, 'yyyy-MM-dd HH:mm:ss'),
          discoverer: item?.quot,
          defectLevel: _this.defectLevelMap.get(item?.level),
          description: item?.describe
        }
        arr.push(val)
      })
      this.defectList = arr
      this.pagetion.total = res?.totalElements || 0
      console.log(this.defectList)
      _this.cd.detectChanges()
      
    })
  }

 
}
