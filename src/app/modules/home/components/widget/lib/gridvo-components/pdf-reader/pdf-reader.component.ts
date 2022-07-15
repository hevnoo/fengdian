import { Component, Input, OnInit } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"; // 转为安全链接

@Component({
  selector: "tb-pdf-reader",
  templateUrl: "./pdf-reader.component.html",
  styleUrls: ["./pdf-reader.component.scss"],
})
export class PdfReaderComponent implements OnInit {
  @Input() ctx: WidgetContext | undefined; // 部件传入

  constructor(private sanitizer: DomSanitizer) {}

  fileUrl: SafeResourceUrl; // 文件的url

  ngOnInit(): void {
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.ctx.widgetConfig.settings.url
    );
  }
}
