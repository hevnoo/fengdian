import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import type {
  IImageInfo,
  IImageEmiter,
  IAllData,
  IMoreImageEmiterType,
} from "@gwhome/fd-knowledge-train/type/type";
import { ComponentEmiterType } from "@gwhome/fd-knowledge-train/type/enum";
import { KonwgledService } from "@gwhome/fd-knowledge-train/konwgled.service";

@Component({
  selector: "tb-image-info",
  templateUrl: "./image-info.component.html",
  styleUrls: ["./image-info.component.scss"],
})
export class ImageInfoComponent implements OnInit {
  constructor(private kscs: KonwgledService) {}
  @Input()
  title = "";
  @Input() imgObjs: IImageInfo[] = [];
  @Output() imageEmiter = new EventEmitter<IImageEmiter>();
  @Input() moreImages: IAllData[] = [];
  @Output() moreEmiter = new EventEmitter<IMoreImageEmiterType>();

  ngOnInit(): void {}
  fullcpn() {
    this.imageEmiter.emit({
      type: ComponentEmiterType.FULL,
      value: { flag: false },
    });
  }
  modalcpn(imageInfo: IImageInfo) {
    const emiterType = this.kscs.judgmentEmiterType(imageInfo);
    this.imageEmiter.emit({
      type: emiterType,
      value: { flag: false, content: imageInfo },
    });
  }
  identify(_: number, item: IImageInfo) {
    return item.name;
  }
  moreModalData(item: IAllData) {
    const emiterType = this.kscs.identifyMoreEmiterType(item);
    this.moreEmiter.emit({
      type: emiterType,
      value: {
        flag: false,
        content: item,
      },
    });
  }
}
