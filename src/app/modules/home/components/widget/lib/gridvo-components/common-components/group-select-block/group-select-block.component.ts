import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
// import { EntityId } from '@app/shared/models/id/entity-id';
// import { EntityType } from '@shared/models/entity-type.models';

export interface IDataList {
    value: any,
    label: string
}

@Component({
    selector: 'tb-group-select-block',
    templateUrl: './group-select-block.component.html',
    styleUrls: ['./group-select-block.component.scss']
})

export class GroupSelectBlockComponent implements OnInit {

    @Input() dataList: IDataList[];
    @Input() isSingleCheck: boolean;
    @Input() delItem: any;
    @Output() checkedChange = new EventEmitter();

    checkedList = new Set()

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
      if(changes?.delItem) {
        this.checkedList.clear()
      }
    }

    // item多选择
    itemCheck(item: IDataList): void {
      this.setCheckStatus(item)
      let arr = []
      this.checkedList.forEach(i => {
        arr.push(i)
      })
      this.checkedChange.emit(arr)
    }

    // item单选择
    itemSingleCheck(item: IDataList): void {
      this.setCheckStatus(item, true)
      this.checkedChange.emit(item)
    }

    // 设置选择状态
    setCheckStatus(item: IDataList, isSingle?: boolean) {
      const isCheck = this.checkedList.has(item.value)
      if(isCheck) {
        this.checkedList.delete(item.value)
      } else {
        if(isSingle) {
          this.checkedList.clear()
        }
        this.checkedList.add(item.value)
      }
    }

    isCheck(item: IDataList) {
      // console.log(item, "条件选择");
      
      if (this.isSingleCheck) {
        this.itemSingleCheck(item)
      }else{
        this.itemCheck(item)
      }
    }

    clearCheckedList() {
      this.checkedList.clear()
    }
}