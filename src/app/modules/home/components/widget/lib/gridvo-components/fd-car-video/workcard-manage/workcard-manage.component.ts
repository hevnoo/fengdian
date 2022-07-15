import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { CarVideoService } from "../../common/services/car-video.service";
import { cloneDeep } from "lodash";

@Component({
  selector: 'tb-workcard-manage',
  templateUrl: './workcard-manage.component.html',
  styleUrls: ['./workcard-manage.component.scss']
})
export class WorkcardManageComponent implements OnInit {
  isWorkCardManageVisible: boolean = false;
  Searchvalue: string = '';
  listOfCurrentPageData: ReadonlyArray<any> = [];
  oTableData = [];
  tableData = [];

  constructor(private CarVideoService: CarVideoService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.CarVideoService.isWorkCardManageVisible$.asObservable().subscribe(res => {
      this.isWorkCardManageVisible = res;
    })
  }
  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<any>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  afterOpen() {
    this.getWorkCardList(this.CarVideoService.workCardList$.getValue());
  }
  public getWorkCardList(list) {
    this.oTableData = cloneDeep(list);
    this.tableData = this.oTableData.filter(Boolean);
    this.ref.detectChanges();
  }

  handleSearch() {
    if (this.Searchvalue == '') {
      this.tableData = this.oTableData;
    } else {
      this.tableData = this.oTableData.filter(item => item.cardcode.includes(this.Searchvalue));
    }
  }

  handleFenceDiaCancel() {
    this.CarVideoService.isWorkCardManageVisible$.next(false);
  }
}
