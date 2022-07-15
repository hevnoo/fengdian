import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CarVideoService, IStaff } from "../../common/services/car-video.service";
import { cloneDeep } from "lodash";
import { NzMessageService } from 'ng-zorro-antd/message';
import { EleFenceService } from "../../common/http/ele-fence.service";
import { Shape } from "../fence-manage/fence-manage.component";

@Component({
  selector: 'tb-fence-list',
  templateUrl: './fence-list.component.html',
  styleUrls: ['../common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FenceListComponent implements OnInit {
  @Output() carOfCheckedId = new EventEmitter();

  FenceList: any[] = [];
  Searchvalue: string = "";
  checked = false;
  setOfCheckedId = new Set<string>();
  listOfCurrentPageData: ReadonlyArray<IStaff> = [];

  tableData: any[] = [];

  constructor(private CarVideoService: CarVideoService,
    private EleFenceService: EleFenceService,
    private ref: ChangeDetectorRef,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.EleFenceService.getFenceList(100, 0).subscribe(fenceData => {
      if (fenceData.data.length > 0) {
        const newData = fenceData.data.reverse().map(item => {
          switch(item.shape) {
            case 'CIRCULAR': item.shape = Shape.CIRCULAR;
              break;
            case 'POLYGON': item.shape = Shape.POLYGON;
              break;
            case 'LINESTRING': item.shape = Shape.LINESTRING;
              break;
            default:
              break;
          };
          item.status = item.status === 1 ? '已开启' : '已关闭';
          item.type = item.type === 'ENTRY_ALARM' ? '进围栏告警' : '出围栏告警';
          return item;
        });
        this.FenceList = newData;
        this.CarVideoService.fenceList = newData;
        this.tableData = cloneDeep(this.FenceList);
        this.ref.detectChanges();
      }
    })
  }

  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<IStaff>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  //  点击按钮
  onItemChecked(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    };
    // console.log()
    this.CarVideoService.selectFenceList$.next(Array.from(this.setOfCheckedId));
  }

  // 搜索
  searchChange(value) {
    if(value == '') {
      this.tableData = this.FenceList;
      return;
    }
    this.tableData = this.FenceList.filter(item => item.name.includes(value))
  }

}
