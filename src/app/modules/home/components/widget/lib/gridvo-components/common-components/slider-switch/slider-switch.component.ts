import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
@Component({
  selector: 'tb-slider-switch',
  templateUrl: './slider-switch.component.html',
  styleUrls: ['./slider-switch.component.scss']
})

export class SliderSwitchComponent implements OnInit {
  @Input() ctx: WidgetContext
  @Input() textArr: string[] = []

  @ViewChild("sliderBlock") sliderBlock: ElementRef

  @Output() handleSwitch = new EventEmitter()

  activeBlock: string = ""

  ngOnInit() {
    if (this.ctx) {
      this.ctx.$scope.sliderSwitchWidget = this
    }
    this.activeBlock = this.textArr?.[0]
  }
  // 点击item
  itemClick($event, item: string): void {
    const offsetLeft = $event.target.offsetLeft
    this.activeBlock = item
    this.sliderBlock.nativeElement.style.left = offsetLeft + "px"
    this.handleSwitch.emit(this.activeBlock)
  }

  reset() {
    this.activeBlock = this.textArr?.[0]
    this.sliderBlock.nativeElement.style.left = 0
  }
}
