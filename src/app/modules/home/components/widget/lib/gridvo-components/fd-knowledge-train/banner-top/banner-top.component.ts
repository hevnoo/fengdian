import { Component, OnInit, Input } from "@angular/core";
import { KonwgledService } from "@app/modules/home/components/widget/lib/gridvo-components/fd-knowledge-train/konwgled.service";
import { WidgetContext } from "@home/models/widget-component.models";

@Component({
  selector: "tb-banner-top",
  templateUrl: "./banner-top.component.html",
  styleUrls: ["./banner-top.component.scss"],
})
export class BannerTopComponent implements OnInit {
  constructor(private konwgledService: KonwgledService) {}

  @Input() ctx: WidgetContext;

  // images = this.konwgledService.getBannerInfo();
  images = [];
  ngOnInit(): void {
    this.images = this.konwgledService.getBannerInfo2(this.ctx);
  }
}
