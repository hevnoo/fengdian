import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
@Component({
  selector: 'tb-collase-panel',
  templateUrl: './collase-panel.component.html',
  styleUrls: ['./collase-panel.component.scss']
})
export class CollasePanelComponent implements OnInit {
  @Input() ctx: WidgetContext;
  @Output() sendTag = new EventEmitter() 

  public operationTypeData: any[];   // 操作类型(创建\删除\更新)
  public operationTimeData: any[];   // 操作时间(今日\本周\本月)
  public tags: any[] = [];  // 标签数组 
  public operationTypeTag: any;   // 操作类型标签
  public operationTimeTag: any;   // 操作时间标签
  public delItem: any; 
  public resumeTypeData = [
    {
      value: 'CREATE',
      label: '巡检',
    },
    {
      value: 'UPDATE',
      label: '定检'
    },
    {
      value: 'DELETE',
      label: '检修'
    },
    {
      value: 'REPAIR',
      label: '故障维修'
    }
  ]
  constructor(private cd: ChangeDetectorRef) { }

  
  ngOnInit(): void {
    
  }

  // 操作类型选择
  resumeType(e) {
   
    let val = this.tags?.map(item => item.label).indexOf(e.label)
    
    if(this.tags.length !== 0 && val !== -1) {
      return 
    }
    this.operationTypeTag = {
      type: '履历类型',
      label: e.label
    }
    let res = this.tags?.map(item => item.type).indexOf(this.operationTypeTag.type)
    if (res !== -1) {
      this.tags.splice(res, 1)
    }
    this.tags.push(this.operationTypeTag)
    
    this.sendTag.emit(this.tags)
  }

  // 删除标签
  handleClose(val) {
    this.tags = this.tags.filter(item => item.value !== val.value)
    this.delItem = val
    console.log(this.delItem, '删除的');

    this.sendTag.emit(this.tags)
    this.cd.detectChanges()
  }

 

  
}
