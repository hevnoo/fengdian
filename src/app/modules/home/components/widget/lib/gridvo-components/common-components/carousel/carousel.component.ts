import { Component, OnInit, Input } from '@angular/core';
import { WidgetConfig } from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
interface IImg {
  img: string;
}
/**
 * @description: 轮播图组件
 * @param {*}
 * @return {*}
 */
@Component({
  selector: 'tb-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  widgetConfig: WidgetConfig;
  imgArr: IImg[] = [];
  @Input() ctx: WidgetContext;
  constructor() { }

  ngOnInit(): void {
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
  }
  private initWidgetConfig() {
    this.imgArr = this.widgetConfig.settings.imgsArr;
  }

}
