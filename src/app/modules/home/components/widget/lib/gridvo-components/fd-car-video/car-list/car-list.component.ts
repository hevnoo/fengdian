import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CarVideoService, IStaff } from "../../common/services/car-video.service";
import { cloneDeep } from "lodash";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tb-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['../common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarListComponent implements OnInit {
  @Output() carOfCheckedId = new EventEmitter();

  CarList: any[] = [];
  Searchvalue: string = "";
  checked = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: ReadonlyArray<IStaff> = [];

  tableData: any[] = [];

  constructor(private CarVideoService: CarVideoService,
    private ref: ChangeDetectorRef,
    private message: NzMessageService) { }

  ngOnInit(): void {
  }
  onCarUpdated(CarList): void {
    const sortList = this.sortTableData(CarList);
    this.CarList = cloneDeep(sortList);
    this.tableData = this.CarList;
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  /**
 * @description: 排序
 * @param {*}
 * @return {*}
 */  
   private sortTableData(res) {
    let onLine = [];
    let offLine = [];
    let undefine = [];
    res.forEach(item => {
      if(item.orientator?.active === '在线') {
        onLine.push(item);
      } else if(item.orientator?.active === '离线') {
        offLine.push(item);
      } else if(typeof(item.orientator?.active) === 'undefined') {
        undefine.push(item);
      }
    });
    // @ts-ignore
    return [...onLine, ...offLine, ...undefine];
  }

  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<IStaff>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  //  点击按钮
  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      const car = this.CarVideoService.carList.filter(item => item.id === id);
      if (car.length > 0 && car[0].orientator.active === '离线') {
        this.message.info('该车辆已离线');
        return;
      } else {
        this.setOfCheckedId.add(id);
      };
    } else {
      this.setOfCheckedId.delete(id);
    };
    this.carOfCheckedId.emit(Array.from(this.setOfCheckedId));
  }

  // 搜索
  searchChange(value) {
    if(value == '') {
      this.tableData = this.CarList;
      return;
    }
    this.tableData = this.CarList.filter(item => item.name.includes(value))
  }

}
