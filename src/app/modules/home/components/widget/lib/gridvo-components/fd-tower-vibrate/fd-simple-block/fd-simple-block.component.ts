import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { DatasourceData } from '@shared/models/widget.models'
import _ from 'lodash'

@Component({
  selector: 'tb-fd-simple-block',
  templateUrl: './fd-simple-block.component.html',
  styleUrls: ['./fd-simple-block.component.scss']
})
export class FdSimpleBlockComponent implements OnInit {
  @Input() ctx: WidgetContext
  @Input() unitKeyValue: string = "{}"
  @Input() title: string
  @Input() sizeRate: number = 15
  @Input() showTitle: boolean
  @Input() freezing: boolean // 冻结数据在最后一次
  @Input() itemStyle: string = "{}"
  @Input() unitStyle: string = "{}"
  @Input() valueStyle: string = "{}"
  @Input() labelStyle: string = "{}"
  @Input() showInDetail: string = "[]"
  @Input() tooltipTrigger: string = "null"
  @Input() tooltipBackgroundColor: string
  @Input() tooltipTitleStyle: string = "{}"
  @Input() tooltipItemStyle: string = "{}"
  @Input() tooltipUnitStyle: string = "{}"
  @Input() tooltipValueStyle: string = "{}"
  @Input() tooltipLabelStyle: string = "{}"

  @ViewChild("title") titleRef: ElementRef<HTMLElement>
  @ViewChild("content") contentRef: ElementRef<HTMLElement>

  private fontSize: number = 1;
  private lastData: DatasourceData[]

  contentItemList: { label: string, key: string, value: number }[]
  itemStyleObj: object
  unitKeyValueMap: object
  unitStyleObj: object
  valueStyleObj: object
  labelStyleObj: object
  showInDetailArr: string[]
  tooltipTitleStyleObj: object
  tooltipItemStyleObj: object
  tooltipUnitStyleObj: object
  tooltipValueStyleObj: object
  tooltipLabelStyleObj: object

  constructor(private el: ElementRef<HTMLElement>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sizeRate) {
      this.resize()
    }
    if (changes.unitKeyValue) {
      try {
        this.unitKeyValueMap = JSON.parse(changes.unitKeyValue.currentValue as string)
      } catch {
        this.unitKeyValueMap = {}
      }
    }
    if (changes.unitStyle) {
      try {
        this.unitStyleObj = JSON.parse(changes.unitStyle.currentValue as string)
      } catch {
        this.unitStyleObj = {}
      }
    }
    if (changes.valueStyle) {
      try {
        this.valueStyleObj = JSON.parse(changes.valueStyle.currentValue as string)
      } catch {
        this.valueStyleObj = {}
      }
    }
    if (changes.labelStyle) {
      try {
        this.labelStyleObj = JSON.parse(changes.labelStyle.currentValue as string)
      } catch {
        this.labelStyleObj = {}
      }
    }
    if (changes.itemStyle) {
      try {
        this.itemStyleObj = JSON.parse(changes.itemStyle.currentValue as string)
      } catch {
        this.itemStyleObj = {}
      }
    }
    if (changes.showInDetail) {
      try {
        this.showInDetailArr = JSON.parse(changes.showInDetail.currentValue as string)
      } catch {
        this.showInDetailArr = []
      }
    }
    if (changes.tooltipUnitStyle) {
      try {
        this.tooltipUnitStyleObj = JSON.parse(changes.tooltipUnitStyle.currentValue as string)
      } catch {
        this.tooltipUnitStyleObj = {}
      }
    }
    if (changes.tooltipValueStyle) {
      try {
        this.tooltipValueStyleObj = JSON.parse(changes.tooltipValueStyle.currentValue as string)
      } catch {
        this.tooltipValueStyleObj = {}
      }
    }
    if (changes.tooltipLabelStyle) {
      try {
        this.tooltipLabelStyleObj = JSON.parse(changes.tooltipLabelStyle.currentValue as string)
      } catch {
        this.tooltipLabelStyleObj = {}
      }
    }
    if (changes.tooltipItemStyle) {
      try {
        this.tooltipItemStyleObj = JSON.parse(changes.tooltipItemStyle.currentValue as string)
      } catch {
        this.tooltipItemStyleObj = {}
      }
    }
    if (changes.tooltipTitleStyle) {
      try {
        this.tooltipTitleStyleObj = JSON.parse(changes.tooltipTitleStyle.currentValue as string)
      } catch {
        this.tooltipTitleStyleObj = {}
      }
    }
  }

  ngOnInit(): void {
    this.ctx.$scope.FdSimpleBlock = this;
  }

  onDataUpdated(): void {
    let data: DatasourceData[] = null
    this.contentItemList = []
    if (this.freezing) {
      data = this.lastData
    } else {
      data = this.ctx.data
      this.lastData = _.cloneDeep(data)
    }
    data.forEach((i: DatasourceData) => {
      const value = i.data?.[i.data.length - 1]?.[1] || 0
      const label = i.dataKey.label
      const key = i.dataKey.name
      this.contentItemList.push({ label, value, key })
    })
  }

  formatTitle(): string {
    return this.title || this.ctx.datasources?.[0]?.aliasName
  }

  formatValue(value: any): string {
    try {
      return Number(value).toFixed(2)
    } catch {
      return "0"
    }
  }

  public resize() {
    const height = this.ctx.height
    const width = this.ctx.width
    this.fontSize = this.sizeRate * width / 100
    if (this.fontSize <= 12) {
      const scale = this.fontSize / 12
      if (this.titleRef) {
        this.titleRef.nativeElement.style.fontSize = this.fontSize + "px"
        this.titleRef.nativeElement.style.transform = `scale(${scale})`
      }
      if (this.contentRef) {
        this.contentRef.nativeElement.style.fontSize = this.fontSize + 'px'
        this.contentRef.nativeElement.style.transform = `scale(${scale})`
      }
    } else {
      if (this.titleRef) {
        this.titleRef.nativeElement.style.fontSize = this.fontSize + "px"
      }
      if (this.contentRef) {
        this.contentRef.nativeElement.style.fontSize = this.fontSize + 'px'
      }
    }
  }

}
