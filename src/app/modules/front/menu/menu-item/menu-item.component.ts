import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TabsService } from '@app/core/services/tabs.service';
import { isMobile } from "@core/utils";

@Component({
  selector: 'tb-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() menu: any = [];
  @Input() isCollapsed: boolean = this.TabsService.collapse;
  @Input() theme: string;

  @Output() menuClick = new EventEmitter();

  currentTab: string[] = this.TabsService.currentTab;

  isMobile: boolean;

  constructor(private TabsService: TabsService,) {
  }

  ngOnInit() {
    this.isMobile = isMobile();
  }

  handleTabClick(tab: any) {
    if (typeof tab.isExternal !== 'undefined' && tab.isExternal === true) {
      const { origin } = window.location;
      window.open(`${origin}/dashboard/${tab.dashboardId}`);
    } else {
      this.TabsService.handleClick(tab);
      this.menuClick.emit(tab)
    }
  }
}

