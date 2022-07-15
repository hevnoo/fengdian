import { Component, Input, OnInit } from '@angular/core';
import { WidgetContext } from '@app/modules/home/models/widget-component.models';
import { EntityType } from '@app/shared/models/entity-type.models';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';

export interface SelectOption {
  label: string,
  value: any,
  [key: string]: any
}

@Component({
  selector: 'tb-fd-tower-vibrate-header',
  templateUrl: './fd-tower-vibrate-header.component.html',
  styleUrls: ['./fd-tower-vibrate-header.component.scss']
})
export class FdTowerVibrateHeaderComponent implements OnInit {  
  @Input() ctx: WidgetContext
  selectedValue: string
  selectOptions: Array<SelectOption> = []
  selectedIndex: number
  tabsList: Array<{ title: string, content: string }> = [
    {
      title: "测点动态",
      content: ""
    },
    {
      title: "监测数据分析",
      content: ""
    },
    {
      title: "趋势比较",
      content: ""
    }
  ]
  constructor() { }
  
  ngOnInit(): void {
    this.ctx.$scope.FdTowerVibrateHeader = this
    this.initSelectValue()
    this.setSelectOption()
    this.initTabsState()
  }

  initTabsState() {
    const stateId = this.ctx.stateController.getStateId()
    for(let i = 0; i < this.tabsList.length; i++) {
      const { title } = this.tabsList[i]
      if(title === stateId) {
        this.selectedIndex = i
        break;
      }
    }
  }

  initSelectValue() {
    if(this.ctx.stateController.getStateId() === "root") {
      this.ctx.stateController.updateState(this.tabsList[0].title, this.ctx.stateController.getStateParams())
    }
  }
  
  trackByParams = (index: number, item: SelectOption): string => {
    return item.label
  }

  setSelectOption() {
    this.selectOptions = this.ctx.datasources.map((i): SelectOption => {
      const { entityId, entityLabel, entityName } = i
      return {
        label: entityLabel.split("/").pop(),
        value: entityId,
        sort: Number(entityName.slice(2))
      }
    })
    this.selectOptions.sort((a, b) => a.sort - b.sort)
    this.selectedValue = this.selectOptions[0].value
  }

  private updateState(id: string) {
    this.ctx.stateController.updateState(this.ctx.stateController.getStateId(), { entityId: { entityType: EntityType.DEVICE, id } })
  }

  selectChange(entityId: string) {
    this.updateState(entityId)
  }

  tabsChange(e: NzTabChangeEvent) {
    const stateId = e.tab.nzTitle
    this.ctx.stateController.updateState(stateId, this.ctx.stateController.getStateParams())
  }
}
