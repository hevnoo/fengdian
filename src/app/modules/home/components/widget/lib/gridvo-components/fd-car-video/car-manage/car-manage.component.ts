import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { CarVideoService } from "../../common/services/car-video.service";
import { cloneDeep } from "lodash";

@Component({
  selector: 'tb-car-manage',
  templateUrl: './car-manage.component.html',
  styleUrls: ['./car-manage.component.scss']
})
export class CarManageComponent implements OnInit {
  isCarManageVisible: boolean = false;
  Searchvalue: string = '';
  listOfCurrentPageData: ReadonlyArray<any> = [];
  oTableData = [];
  tableData = [];

  constructor(private CarVideoService: CarVideoService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.CarVideoService.isCarManageVisible$.asObservable().subscribe(res => {
      this.isCarManageVisible = res;
    })
  }
  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<any>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  afterOpen() {
    this.getCarList(this.CarVideoService.carList);
  }
  public getCarList(list) {
    this.oTableData = cloneDeep(list);
    this.tableData = this.oTableData.filter(Boolean);
    this.ref.detectChanges();
  }

  handleSearch() {
    if (this.Searchvalue == '') {
      this.tableData = this.oTableData;
    } else {
      this.tableData = this.oTableData.filter(item => item.name.includes(this.Searchvalue));
    }
  }

  handleFenceDiaCancel() {
    this.CarVideoService.isCarManageVisible$.next(false);
  }
}
