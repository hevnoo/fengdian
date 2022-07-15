import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { WidgetConfig } from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { AnnouncementService } from "@core/http/announcement.service";
import { IAnnouncement } from "../../fd-announcement-manage/type";
import { Router } from '@angular/router';
import { TabsService } from "@core/services/tabs.service";
import { MenuElement } from '@app/modules/home/pages/admin/front-settings/front-settings.component';
/**
 * @description: 通知栏组件
 * @param {*}
 * @return {*}
 */
@Component({
  selector: 'tb-notice-bar',
  templateUrl: './notice-bar.component.html',
  styleUrls: ['./notice-bar.component.scss']
})
export class NoticeBarComponent implements OnInit {
  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;
  noticeData: IAnnouncement[] = [];
  goTo: string;
  constructor(private AnnouncementService: AnnouncementService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private TabsService: TabsService) { }

  ngOnInit(): void {
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
    this.AnnouncementService.getPaging(0, 4).subscribe((res: any) => {
      if(res.data.length > 0) {
        this.noticeData = res.data;
        this.ref.detectChanges();
      }
    })
  }
  private initWidgetConfig() {
    this.goTo = this.widgetConfig.settings.goTo;
  }

  handleMenu() {
    if(typeof(this.goTo) !== 'undefined') {
      const tab: MenuElement = {
        name: "通知栏详情",
        dashboardId: this.goTo,
      };
      this.TabsService.handleClick(tab);
    }
  }

}
