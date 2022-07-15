import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RegularInspectionService } from '@app/core/http/regular-inspection.service';
import { WidgetContext } from '@home/models/widget-component.models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataItem } from './type'

interface PageInfo {
  page: number,
  pageSize: number,
  total: number
}
@Component({
  selector: 'tb-fd-regular-inspection',
  templateUrl: './fd-regular-inspection.component.html',
  styleUrls: ['./fd-regular-inspection.component.scss']
})
export class RegularInspectionComponent implements OnInit {
  @Input() ctx: WidgetContext;

  public tableData: DataItem[]   // 表格数据

  public checked: boolean;  // check选中状态
  public isChecked: boolean;  // 展示部分按钮
  setOfCheckedId = new Set<number>();  // 存储被选中的check框的id
  listOfCurrentPageData: any[] = []  // 存储当前页面的表格数据
  indeterminate = false;
  public dataId: string;
  public showViewModel: boolean = false   // 消失查看弹窗
  public showAddModel: boolean = false   // 显示添加弹窗
  public showChangeModel: boolean = false  // 显示修改弹窗
  public pagetion: PageInfo = {
    page: 1,
    pageSize: 10,
    total: 0
  }
  public tableThead = [
    {
      key: 'deviceName',
      label: '定检设备'
    },
    {
      key: 'name',
      label: '定检名称',
      thStyle: {
        width: '15%'
      }
    },
    {
      key: 'periodDay',
      label: '定检周期(天)'
    },
    {
      key: 'lastCreateTime',
      label: '最近发起时间',
      sortOrder: 'null',
      sortFn: (a: DataItem, b: DataItem) => a.lastCreateTime - b.lastCreateTime,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      key: 'lastCompletedTime',
      label: '最近完成时间',
      sortOrder: 'null',
      sortFn: (a: DataItem, b: DataItem) => a.lastCompletedTime - b.lastCompletedTime,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      key: 'nextInspectionTime',
      label: '下次定检时间',
      sortOrder: 'null',
      sortFn: (a: DataItem, b: DataItem) => a.nextInspectionTime - b.nextInspectionTime,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      key: 'status',
      label: '状态'
    },
    {
      key: 'descr',
      label: '备注',
      thStyle: {
        width: '15%'
      }
    },
    {
      key: 'optainer',
      label: '定检项'
    }
  ]
  public inspectionTime: string   // 搜索定检周期
  public devId   // 设备ID
  public viewData  // 查看时的数据
  public changeData  // 修改传递的数据

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private cd: ChangeDetectorRef,
    private regularInspectService :RegularInspectionService
  ) { }

  ngOnInit(): void { 
    this.getListData(this.pagetion.page)
  }

  // 更新选中框
  updateCheck(id, checked) {
    if(checked) {
      this.setOfCheckedId.add(id)
    }else {
      this.setOfCheckedId.delete(id)
    }

  }

  refreshCheckedStatus() {
    this.checked = this.listOfCurrentPageData.every( item => {
      this.setOfCheckedId.has(item.id)
    } )
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  
  // 监听表格数据发生变化
  onCurrentPageDataChange(e) {
    this.listOfCurrentPageData = e
    this.refreshCheckedStatus()
  }

  // 全选
  onAllChecked(e) {
    this.isChecked = e
    this.listOfCurrentPageData.forEach(item => {
      this.updateCheck(item.id, e)
    })
    this.refreshCheckedStatus()
  }

  // 单选
  onItemChecked(id, e, data) {
    this.isChecked = e
    this.setOfCheckedId.clear()
    this.updateCheck(id, e)
    this.refreshCheckedStatus()
    this.changeData = data
    this.dataId = id
    console.log(data, this.dataId, '单选。。。');
  
  }

  // 处理后端获取的表格数据
  initSetting(item) {
    item.deviceName = Boolean(item?.device?.label.split('#')[1]) ? `#${item?.device?.label.split('#')[1]}` : item?.device?.label
    if (item.status == '已超期') {
      item['statusStyle'] = {
      'border': `1px solid #ffdbdb`,
      'background-color': '#ffeded',
      'color': '#f56c6c',
      'font-size': '12px',
      'padding': '3px'
      }
    } else {
      item['statusStyle'] = {
        'border': `1px solid #d1e9ff`,
        'background-color': '#e8f4ff',
        'color': '#1890ff',
        'font-size': '12px',
        'padding': '3px'

      }
    }
  }

  // 获取表格数据
  getListData(page) {
    let that = this
    let query = `page=${page-1}&pageSize=${this.pagetion.pageSize}`
    this.regularInspectService.getPageInfo(query).subscribe((res) => {
      console.log(res, 'res---')
      that.tableData = res?.data
      this.tableData.forEach(item => {
        that.initSetting(item)
      })
      console.log(this.tableData, "定检表格数据"); 
      
      this.pagetion.total = res.totalElements
      that.cd.detectChanges()
    })
    
    
  }

  // 修改和新增重新请求数据
  requestData() {
    this.pagetion.page = 1
    this.getListData(1)
  }

  // 用处理搜索的数据的调用
  searchApi(query) {
    let that = this
    that.regularInspectService.getOtherData(query).subscribe(res => {
      console.log('请求数据',res);
      
      that.tableData = res
      that.tableData.forEach(item => {
        that.initSetting(item)
      })
      that.cd.detectChanges()
      that.pagetion.total = that.tableData.length
    })
  }

  // 搜索数据
  searchData() {
    let timeLen = this.inspectionTime?.length
    let devIdLen = this.devId?.length
    
    if (!Boolean(timeLen) && Boolean(devIdLen)) {
      let query = `deviceId=${this.devId}`
      this.searchApi(query)
      return
    }
    if (Boolean(timeLen) && !Boolean(devIdLen)) {
      let query = `periodDay=` + parseInt(this.inspectionTime)
      console.log('搜索字段', query);
      this.searchApi(query)
      return
    }
    if (Boolean(timeLen) && Boolean(devIdLen)) {
      let query = `deviceId=${this.devId}&&periodDay=` + parseInt(this.inspectionTime)
      console.log('搜索字段', query);
      this.searchApi(query)
      return
    } 
    this.getListData(1)
    
  }


  // 查看详情
  viewDetail(data) {
    this.showViewModel = true
    this.viewData = data
  }
  
  // 关闭详情弹窗
  closeView(e) {
    this.showViewModel = e
  }

  // 开启添加弹窗
  addItem() {
    this.showAddModel = true
  }

  // 关闭添加和修改弹窗
  closeModel(e) {
    this.showAddModel = e
    this.showChangeModel = e
  }

  // 开启修改弹窗
  changeItem() {
    this.showChangeModel = true
    this.isChecked = false
    this.setOfCheckedId.clear()
  }

  // 获取选择的设备ID
  getDevData(e) {
    this.devId = e
  }

  // 删除按钮的点击事件，弹出确认框
  confirmDel() {
    if(this.changeData.type == 2){
      this.modal.confirm({
        nzTitle: '您确定要删除选定的内容吗?',
        nzOkText: '确定',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.regularInspectService.delData(this.dataId).subscribe(res => {
            this.isChecked = false
            this.setOfCheckedId.clear()
            this.getListData(1)
            this.message.create('success', '删除成功！')
          }, err => {
            console.log(err, "删除")
            this.message.create('error', '删除失败！')
          })
                                
        },
        nzCancelText: '取消', 
        nzOnCancel: () => console.log('Cancel')
      });
    }else {
      this.isChecked = false
      this.setOfCheckedId.clear()
      this.message.create('warning', `该数据由第三方上传，无法删除！`);
    }
    
  }

  // 发起按钮触发的事件
  launch() {
    this.modal.confirm({
      nzTitle: '确定要发起吗?',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => console.log('OK'),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 分页返回
  pageIndexChange(e) {
    this.pagetion.page = e
    this.getListData(e)
  }

  pageSizeChange(e) {
    this.pagetion.pageSize = e
    this.getListData(this.pagetion.page)
  }
 
}
