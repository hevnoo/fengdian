import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';

interface IPage {
  page: number,
  pageSize: number
  total: number
}
@Component({
  selector: 'tb-dialog-table',
  templateUrl: './dialog-table.component.html',
  styleUrls: ['./dialog-table.component.scss']
})


export class DialogTableComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Input() checkDisabled: boolean = false;  //是否禁用复选框
  @Input() dataList: any[];    // 表格数据
  @Input() theadData: any[];   // 表头数据
  @Input() isShowCheck: boolean;   // 是否添加复选框
  @Input() frontPag: boolean = true;   // 是否显示分页器
  @Input() isSearch: boolean = true;   // 是否显示搜索按钮
  @Input() isShowAdd: boolean = false;   // 是否显示添加按钮
  @Input() placeholderValue: string;   // 搜索框默认文字
  @Input() total: number;  // 把表格数据总数
  @Output() addModelVisible = new EventEmitter() 
  @Output() pageChange = new EventEmitter() 
  public tableData
  
  public pagination: IPage = {
    page: 1,
    pageSize: 10,
    total: 0
  }

  constructor( private cd: ChangeDetectorRef ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges() {
    this.tableData = this.initTableData(this.dataList)
    console.log(this.tableData, this.dataList, 'testDefect');
    // this.cd.detectChanges();
    this.pagination.total = this.total
  }

 // 表格数据处理 {0: 数据值, 1: 数据值, ...}
  initTableData(data) {
    let value = data.map(item=>{
      const resultObj = {};
      let index = 0;
      Object.values(item).forEach( value => resultObj[index++] = value);
      return resultObj;
    });
    // console.log(value);

    return value
  }


  // 返回表格数据属性值数组
  getArray(obj){
    return Object.keys(obj);
  }

  // 搜索数据
  searchData(e) {
    if (typeof(e) == 'undefined' || e == '') {
      this.tableData = this.initTableData(this.dataList)
      this.pagination.total = this.total
      return 
    }
    let arr = []
    this.theadData.forEach(itemx => {
      let val
      if( itemx.label == this.placeholderValue) {
        val = itemx.key
        this.dataList.forEach(itemy => {    
            if (itemy[val].indexOf(e) !== -1) {
              arr.push(itemy)
            } 
          })
      }
    })
    this.tableData = this.initTableData(arr)
    this.pagination.total = this.tableData.length
  }

  addData(e) {
    this.addModelVisible.emit(e)
  }

  pageSizeChange(e) {
    this.pagination.pageSize = e
    this.pageChange.emit(this.pagination)

  }
  
  pageIndexChange(e) {
    this.pagination.page = e
    console.log("小表格", this.pagination)
    this.pageChange.emit(this.pagination)
  
  }

}
