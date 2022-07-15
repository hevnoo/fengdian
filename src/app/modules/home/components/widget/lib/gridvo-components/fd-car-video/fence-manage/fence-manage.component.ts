import { Component, OnInit, ViewChild, ChangeDetectorRef, DoCheck, Output, EventEmitter } from '@angular/core';
import { CarVideoService } from "../../common/services/car-video.service";
import { EleFenceService } from "../../common/http/ele-fence.service";
import { cloneDeep } from "lodash";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModelAddEditComponent } from "./model-add-edit/model-add-edit.component";
export enum Shape {
  LINESTRING = '线形围栏',
  POLYGON = '多边形围栏',
  CIRCULAR = '圆形围栏'
}
export interface IFenceTableData {
  id: string;
  name: string;
  type: string;
  status: number | string;
  stayedTime: number;
  shape: string;
  buffer: number;
  coordinate: string;
  remark: string;
  [propName: string]: string | number;
}

@Component({
  selector: 'tb-fence-manage',
  templateUrl: './fence-manage.component.html',
  styleUrls: ['./fence-manage.component.scss']
})
export class FenceManageComponent implements OnInit {
  @ViewChild("addOrEditFenceModel", { static: true }) addOrEditFenceModel: ModelAddEditComponent;
  @Output() mapRegionEmiter = new EventEmitter();
  isFenceTableVisible: boolean = false;

  Searchvalue: string = "";
  isShowOperationBtn: boolean = false;

  setOfCheckedId = undefined;
  listOfCurrentPageData: ReadonlyArray<IFenceTableData> = [];
  // 元表格数据
  oTableData: IFenceTableData[] = [];
  tableData: IFenceTableData[] = [];

  constructor(private CarVideoService: CarVideoService,
              private EleFenceService: EleFenceService,
              private ref: ChangeDetectorRef,
              private message: NzMessageService,
              private modal: NzModalService,) { }

  ngOnInit(): void {
    this.loadData();
    this.CarVideoService.isFenceTableVisible$.asObservable().subscribe(res => {
      this.isFenceTableVisible = res;
    })
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
        this.oTableData = newData;
        this.tableData = cloneDeep(this.oTableData);
        this.setOfCheckedId = undefined;
        this.ref.detectChanges();
      }
    })
  }

  // 添加完电子围栏后的回调
  closeAddFenceEmiter() {
    this.loadData();
  }

  handleFenceDiaCancel() {
    this.CarVideoService.isFenceTableVisible$.next(false);
    this.setOfCheckedId = undefined;
  }

  showAddModel() {
    this.CarVideoService.isAddFenceVisible$.next(true);
    this.addOrEditFenceModel.title = '新增电子围栏';
  }

  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<IFenceTableData>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }
  //  点击按钮
  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId = id;
    } else {
      this.setOfCheckedId = undefined;
    }
    this.isShowOperationBtn = typeof (this.setOfCheckedId) !== 'undefined';
  }

  // 搜索
  handleSearch() {
    if (this.Searchvalue == '') {
      this.tableData = this.oTableData;
    } else {
      this.tableData = this.oTableData.filter(item => item.name.includes(this.Searchvalue));
    }
  }

  handleDelete() {
    this.modal.confirm({
      nzTitle: '您确定要删除吗?',
      // nzContent: '',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnCancel: () => { },
      nzOnOk: () => {
        this.EleFenceService.deleteFenceById(this.setOfCheckedId).subscribe(res => {
          if (res) {
            this.message.success('删除成功!');
            this.setOfCheckedId = undefined;
            this.loadData();
          }
        })
      },
    });

  }

  // 修改
  modifyFence() {
    if (typeof (this.setOfCheckedId) === 'undefined') {
      this.message.info(`请选择电子围栏名称进行修改!`);
      return;
    };
    const selectItem: IFenceTableData[] = this.oTableData.filter(item => item.id == this.setOfCheckedId);
    if(selectItem.length > 0) {
      this.addOrEditFenceModel.modifyFence(selectItem[0]);
      this.addOrEditFenceModel.title = '修改电子围栏';
    }
  }

  // 地图区域
  mapRegion(fenceInfo) {
    this.mapRegionEmiter.emit(fenceInfo);
    this.setOfCheckedId = undefined;
    this.CarVideoService.isFenceTableVisible$.next(false);
  }
}
