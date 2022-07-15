import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ResumeChromicleService } from '@app/core/http/resume-chronicle.service';
import { WidgetContext } from '@home/models/widget-component.models';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tb-fd-resume-chromicle',
  templateUrl: './fd-resume-chromicle.component.html',
  styleUrls: ['./fd-resume-chromicle.component.scss']
})
export class ResumeChromicleComponent implements OnInit {
  @Input() ctx: WidgetContext;

  public resumeChromicThead = [
    {
      label: '履历类型',
      key: 'resumeType'
    },
    {
      label: '设备名称',
      key: 'deviceName'
    },
    {
      label: '工作内容',
      key: 'workContent',
    },
    {
      label: '负责人',
      key: 'personInCharge'
    },
    {
      label: '参与人',
      key: 'participant'
    },
    {
      label: '工作开始时间',
      key: 'workStartTime',
    },
    {
      label: '工作结束时间',
      key: 'workEndTime'
    },
    {
      label: '记录人',
      key: 'recorder'
    }
  ]
  public placeholderValue = '负责人';
  public isCheck: boolean = false;

  public tableData = []
  public checked: boolean;
  public addDataModel: boolean;
  public changeDataModel: boolean;
  public dataId: any;
  public formData: any;  // 修改时的表单数据
  public pagetion = {
    page: 1,
    pageSize: 10,
    total: 0
  };
  public searchVal: string = ''
  public searchType: any = ''
  listOfCurrentPageData: any[] = [];
  setOfCheckedId = new Set<number>();
  resumeTypeMap = new Map<string, string>()
    .set('CREATE', '巡检')
    .set('UPDATE', '定检')
    .set('DELETE', '检修')
    .set('REPAIR', '故障维修')
  getTypeMap = new Map<string, string>()
    .set('巡检', 'CREATE')
    .set('定检', 'UPDATE')
    .set('检修', 'DELETE')
    .set('故障维修', 'REPAIR')
  constructor(
    private resumeChromicleService: ResumeChromicleService,
    private modal: NzModalService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getListData(this.pagetion.page)
  }

  getListData(page?: number) {
    // console.log(pagetion);
    let that = this

    let query = `page=${page - 1}&pageSize=${that.pagetion.pageSize}`
    console.log(111);
    that.resumeChromicleService.getPageInfo(query).subscribe(res => {
      this.proServerData(res)
    })
    // console.log('chromicle', res, query);

  }

  // 提价成功，重新请求数据
  againReset() {
    this.getListData(1)
  }

  // 搜索框搜索数据
  searchData(e, page, pageSize) {
    this.searchVal = e
    if (typeof (e) == 'undefined' || e == '') {
      this.pagetion.page = 1
      this.getListData(this.pagetion.page)
      return
    }
    this.pagetion.page = page
    this.pagetion.pageSize = pageSize
    let pagequery = `page=${page - 1}&pageSize=${pageSize}`
    let secdata = `principal=${e}`
    if (this.searchType?.length > 0) {
      console.log("2345");
      secdata = `principal=${e}&type=${this.getTypeMap.get(this.searchType[0].label)}`
    }
    this.resumeChromicleService.searchData(pagequery, secdata).subscribe(res => {
      this.proServerData(res)
    })
  }

  // 按照标签搜索数据
  tagSearchData(e, page, pageSize) {
    this.searchType = e
    if (e.length == 0) {
      this.pagetion.page = 1
      this.getListData(this.pagetion.page)
      return
    }
    this.pagetion.page = page
    this.pagetion.pageSize = pageSize
    let pagequery = `page=${page - 1}&pageSize=${pageSize}`
    let secdata = `type=${this.getTypeMap.get(e[0].label)}`
    if (this.searchVal) {
      secdata = `type=${this.getTypeMap.get(e[0].label)}&principal=${this.searchVal}`
    }
    console.log(secdata, "履历类型", e, this.getTypeMap.get(e[0].label))
    this.resumeChromicleService.searchData(pagequery, secdata).subscribe(res => {
      this.proServerData(res)
    })
  }


  // 添加数据，出现弹窗
  addData(e) {
    this.addDataModel = e
  }

  offAddModel(e) {
    this.addDataModel = e
  }

  // 修改数据，出现弹窗
  changeData(e) {
    this.changeDataModel = e
    this.setOfCheckedId.clear()
    this.isCheck = false
  }

  offChangeModel(e) {
    this.changeDataModel = e
  }

  // 更新选中框
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.clear()
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }

    if (this.setOfCheckedId.size > 0) {
      this.isCheck = true
    } else {
      this.isCheck = false
    }

  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));

  }
  // 监测表格数据变化
  onCurrentPageDataChange($event): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  // 全选
  onAllChecked(e) {
    this.isCheck = e
    this.listOfCurrentPageData.forEach(item => {
      this.updateCheckedSet(item.id, e)
    });
    this.refreshCheckedStatus();
  }

  // 单选
  onItemChecked(id, e, data) {
    this.updateCheckedSet(id, e);
    this.refreshCheckedStatus();
    // this.isCheck = e
    this.dataId = id
    this.formData = data
  }

  // 删除数据
  deleteValue(e) {
    this.modal.confirm({
      nzTitle: '您确定要删除选定的内容吗?',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.resumeChromicleService.delChronicleData(this.dataId).subscribe(res => {
          this.isCheck = false
          this.getListData(1)
        })

      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });

  }

  // 换页
  pageIndexChange(e) {
    this.pagetion.page = e
    if (this.searchVal) {
      this.searchData(this.searchVal, e, this.pagetion.pageSize)
      return
    }
    if (this.searchType.length > 0) {
      this.tagSearchData(this.searchType, e, this.pagetion.pageSize)
      return
    }
    this.getListData(e)
  }

  // 更换每页显示的条数
  pageSizeChange(e) {
    this.pagetion.pageSize = e
    if (this.searchVal) {
      this.searchData(this.searchVal, this.pagetion.page, e)
      return
    }
    if (this.searchType.length > 0) {
      this.tagSearchData(this.searchType, this.pagetion.page, e)
      return
    }
    this.getListData(this.pagetion.page)

  }

  // 服务端获取的数据处理
  proServerData(res) {
    let arr = []
    res.data.forEach(item => {
      // console.log(item);
      let val = {
        id: item.id,
        resumeType: this.resumeTypeMap.get(item?.type) || '',
        deviceName: item.device?.label,
        deviceId: item.device?.id?.id || '',
        workContent: item?.descr || '',
        personInCharge: item?.principal || '',
        participant: item?.participant || '',
        workStartTime: this.datePipe.transform(item?.beginTime, 'yyyy-MM-dd HH:mm:ss') || '',
        workEndTime: this.datePipe.transform(item?.endTime, 'yyyy-MM-dd HH:mm:ss') || '',
        recorder: item.creator?.name || '',
        recorderId: item.creator?.id?.id || ''
      }

      arr.push(val)
    })
    this.tableData = arr
    this.pagetion.total = res.totalElements
    this.cd.detectChanges()
    console.log(this.tableData, "履历表格信息")

  }

}
