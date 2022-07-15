import { Component, OnInit, ViewChild, DoCheck, ChangeDetectorRef, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { CarVideoService, IStaff } from "../../common/services/car-video.service";
import { cloneDeep } from "lodash";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tb-person-manage',
  templateUrl: './person-manage.component.html',
  styleUrls: ['./person-manage.component.scss'],
})
export class PersonManageComponent implements OnInit {
  @ViewChild("personAddModal", { static: true }) personAddModal: any;
  @ViewChild("tplWorkCardSelect", { static: true }) tplWorkCardSelect: TemplateRef<{}>;
  isPersonManageVisible: boolean = false;

  isAddPersonVisible: boolean = false; //add modal可见性

  Searchvalue: string = "";
  isShowOperationBtn: boolean = false;

  setOfCheckedId = undefined;
  listOfCurrentPageData: ReadonlyArray<IStaff> = [];
  // 元表格数据
  oTableData: IStaff[];;
  tableData: IStaff[] = [];

  // 双向绑定工卡
  bindWordCard: string = '';
  workCardList;
  constructor(private CarVideoService: CarVideoService,
    private ref: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.CarVideoService.isPersonManageVisible$.asObservable().subscribe(res => {
      this.isPersonManageVisible = res;
    })
  }
  afterOpen() {
    this.getStaffList(this.CarVideoService.staffList);
  }

  getStaffList(staffList) {
    staffList.sort((a, b) => b.id -a.id);
    this.oTableData = cloneDeep(staffList);
    this.tableData = this.oTableData.filter(Boolean);
    this.workCardList = this.CarVideoService.workCardList$.getValue();
    this.ref.detectChanges();
  }

  handleFenceDiaCancel() {
    this.CarVideoService.isPersonManageVisible$.next(false);
    this.setOfCheckedId = undefined;
  }
  // 添加
  showAddModel() {
    this.setOfCheckedId = undefined;
    this.isAddPersonVisible = true;
    this.personAddModal.addStaff();
  }
  // 修改
  modifyStaff() {
    if (typeof (this.setOfCheckedId) === 'undefined') {
      this.message.info(`请选择人员进行修改!`);
      return;
    };
    this.isAddPersonVisible = true;
    this.personAddModal.modifyStaff(this.setOfCheckedId);
  }
  // 删除
  deleteStaff() {
    this.modal.confirm({
      nzTitle: '您确定要删除吗?',
      // nzContent: '',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnCancel: () => {},
      nzOnOk: () => {
        if(typeof(this.setOfCheckedId) === 'undefined') return;
        this.CarVideoService.deleteStaff(this.setOfCheckedId).then(res => {
          if (res) {
            this.getStaffList(this.CarVideoService.staffList);
            this.setOfCheckedId = undefined;
            this.isShowOperationBtn = false;
          }
        });
      },
    });
  }
  // 添加完员工的回调
  closeAddPersonEmiter(e) {
    this.isAddPersonVisible = e;
    this.getStaffList(this.CarVideoService.staffList);
  }

  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<IStaff>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }
  //  点击按钮
  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId = id;
    } else {
      this.setOfCheckedId = undefined;
    }
    this.isShowOperationBtn = typeof(this.setOfCheckedId) !== 'undefined';
  }

  // 搜索
  handleSearch() {
    if (this.Searchvalue == '') {
      this.tableData = this.oTableData;
    } else {
      this.tableData = this.oTableData.filter(item => item.name.includes(this.Searchvalue));
    }
  }

  bindWorkCard(staffInfo: IStaff) {
    if (typeof (staffInfo.workCard) === 'string') {
      this.message.info(`此人员已绑定工卡!`);
    } else {
      this.modal.create({
        nzTitle: '人员工卡绑定',
        nzContent: this.tplWorkCardSelect,
        nzMaskClosable: false,
        nzClosable: false,
        nzOnOk: () => {
          staffInfo.workCard = this.bindWordCard;
          this.CarVideoService.addAndModifyStaff(staffInfo).then(res => {
            if (res) {
              this.getStaffList(this.CarVideoService.staffList);
              this.bindWordCard = '';
            }
          });
        },
        nzOnCancel: () => {
          this.bindWordCard = '';
        }
      });
    }
  }
  unBindWorkCard(staffInfo: IStaff) {
    if (typeof (staffInfo.workCard) !== 'string') {
      this.message.info(`请先绑定工卡!`);
      return;
    }
    this.modal.confirm({
      nzTitle: '您确定要解绑吗?',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzCancelText: '取消',
      nzOnCancel: () => { },
      nzOnOk: () => {
        this.CarVideoService.unBindWorkCard(staffInfo).then(res => {
          if (res) {
            this.getStaffList(this.CarVideoService.staffList);
            this.setOfCheckedId = undefined;
            this.isShowOperationBtn = false;
          }
        });
      },
    });
  }
}
