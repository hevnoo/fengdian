import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TabsService } from '@app/core/services/tabs.service';
import { Router } from '@angular/router';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { deepClone } from '@app/core/utils';

@Component({
  selector: 'tb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Output() tabClick = new EventEmitter()

  @Input() theme: string;
  tabList: any = [];

  crtTab: any;
  crtRightClickTab: any = null;

  constructor(private TabsService: TabsService,
    private router: Router,
    private nzContextMenuService: NzContextMenuService) {
    this.tabList = this.TabsService.tabList;
  }

  ngOnInit() {
    this.crtTab = this.TabsService.currentTab;
  }

  removeTab(tab: any) {
    if (this.tabList.length === 1) return;

    this.TabsService.removeTab(tab);

    let id = this.tabList[this.tabList.length - 1].dashboardId;
    this.router.navigateByUrl(`front/dashboard/${id}`);
  }

  handleTabClick(tab: any) {
    this.TabsService.handleClick(tab);
    this.tabClick.emit(tab)
  }

  contextmenuFn(e: MouseEvent, menu: NzDropdownMenuComponent, tab: any) {
    this.crtRightClickTab = tab
    this.nzContextMenuService.create(e, menu);
  }
  rightMenuClick(type) {
    switch (type) {
      case 0:
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate([`front/dashboard/${this.crtRightClickTab.dashboardId}`]);
          this.handleTabClick(this.crtRightClickTab)
        });
        break;
      case 1:
        this.removeTab(this.crtRightClickTab)
        break;
      case 2:
        let oldTabList = deepClone(this.tabList)
        oldTabList.forEach(item => {
          if (item.name !== this.crtRightClickTab.name) {
            this.TabsService.removeTab(item);
          }
        });
        this.handleTabClick(this.crtRightClickTab)
        break;
      default:
        this.TabsService.toggleDefaultTab()
        break;
    }
  }
}
