import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import * as device from '../../device-resume-dialog.module'
@Component({
  selector: 'tb-dialog-search-button',
  templateUrl: './dialog-search-button.component.html',
  styleUrls: ['./dialog-search-button.component.scss']
})
export class DialogSearchButtonComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Input() isShowAdd: boolean = false;
  @Input() placeholderVal: string = '请输入属性值';
  @Input() isCheck: boolean = false;
  @Output() searchVal = new EventEmitter()
  @Output() modelVisible = new EventEmitter()
  @Output() showChangeModel = new EventEmitter()
  @Output() delVal = new EventEmitter()

  public searchValue: string="";
  public isVisible: boolean

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges() {
   
  }


  searchData() {
    this.searchVal.emit(this.searchValue)
  }

  inputBlur() {
    if(this.searchValue !== '') return
    this.searchVal.emit(this.searchValue)
  }

  addData() {
    this.isVisible = true
    this.modelVisible.emit(this.isVisible)
  }

  // 修改按钮
  changeData() {
    this.showChangeModel.emit(true)
  }

  delData() {
    this.delVal.emit(true)
  }
}
