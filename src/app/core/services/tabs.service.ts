import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, of, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { PageLink } from '@shared/models/page/page-link';
import { emptyPageData, PageData } from '@shared/models/page/page-data';
import { DashboardInfo } from '@app/shared/models/dashboard.models';

import { Store } from '@ngrx/store';
import { AppState } from '@app/core/core.state';
import { getCurrentAuthUser } from '@app/core/auth/auth.selectors';
import { Authority } from '@shared/models/authority.enum';

import { AttributeService } from '@core/http/attribute.service';
import { EntityService } from "@core/http/entity.service";
import { DashboardService } from '@core/http/dashboard.service';

import { EntityId } from '@shared/models/id/entity-id';
import { EntityType } from '@shared/models/entity-type.models';
import { AttributeScope } from '@shared/models/telemetry/telemetry.models';

import { MenuElement } from "@home/pages/admin/front-settings/front-settings.component";

import { NULL_UUID } from '@shared/models/id/has-uuid';
import { filter } from 'rxjs/operators';
type FullBG = {
  dashboardId: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  tabList: MenuElement[] = [];

  currentTab: string[] = [];

  collapse: boolean = true;

  fullBg: Array<FullBG> = [];
  isFullBg: boolean = false;

  // 菜单数据
  originMenuData: MenuElement[] = [];

  // webview需提供的url
  mobileHomepageDashboardID: string = undefined;
  mobileWorkbenchDashboardID: string = undefined;

  assetType: EntityId = {
    entityType: EntityType.ASSET,
    id: null,
  }

  routerLister$: Subscription = null;
  isShowBack$ = new BehaviorSubject<boolean>(false);

  // 获取主题
  theme: string = localStorage.getItem('themeValue') || 'dark';

  constructor(private store: Store<AppState>,
    private router: Router,
    private attributeService: AttributeService,
    private EntityService: EntityService,
    private dashboardService: DashboardService,
    private location: Location) { 
      this.listenRouterChange(); 
  }

  public reset() {
    this.tabList = [];
    this.currentTab = [];
    this.collapse = true;
    this.fullBg = [];
    this.isFullBg = false;
    this.originMenuData = [];
    this.mobileHomepageDashboardID = undefined;
    this.mobileWorkbenchDashboardID = undefined;
    this.assetType.id = null;
    this.theme = localStorage.getItem('themeValue') || 'dark';
  }

  public setTabList(tab: MenuElement) {
    if (this.tabList.length <= 0) {
      this.tabList.push(tab);
    } else if (this.tabList.findIndex(t => t.name === tab.name) < 0) {
      this.tabList.push(tab);
    }
  }

  public toggleCollapse() {
    this.collapse = !this.collapse;
  }

  public setCurrentTab(tab: MenuElement) {
    this.currentTab[0] = tab.name;
  }

  public removeTab(tab: MenuElement) {
    const idx: number = this.tabList.findIndex(t => t.name === tab.name);
    if (idx > -1) {
      this.tabList.splice(idx, 1);
    }

    this.currentTab[0] = this.tabList[this.tabList.length - 1].name;
  }

  public clearTabList() {
    this.tabList.length = 0;
  }

  public handleClick(tab: MenuElement): Promise<boolean> {
    this.checkFullBg(tab);
    return new Promise(resolve => {
      this.router.navigateByUrl(`front/dashboard/${tab.dashboardId}`).then(() => {
        resolve(true)
      })
      this.setCurrentTab(tab);
      this.setTabList(tab);
    })
  }

  public goBack() {
    const workbench: MenuElement = {
      name: "工作台",
      dashboardId: this.mobileWorkbenchDashboardID,
    }
    // this.location.back();
    this.handleClick(workbench);
  }

  private listenRouterChange() {
    this.routerLister$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlSegments = event.url.split("?")[0].split("/");
      const dashboardId = urlSegments[urlSegments.length - 1];
      if (dashboardId === this.mobileHomepageDashboardID) {
        this.isShowBack$.next(false);
        const tab = {
          dashboardId: dashboardId,
          name: '首页'
        }
        this.setCurrentTab(tab);
      } else if(dashboardId === this.mobileWorkbenchDashboardID) {
        this.isShowBack$.next(false);
        const tab = {
          dashboardId: dashboardId,
          name: '工作台'
        }
        this.setCurrentTab(tab);
      } else {
        this.isShowBack$.next(true);
      }
    })
  }

  public getMenuData() {
    return new Promise(resolve => {
      this.EntityService.getEntitiesByNameFilter(EntityType.ASSET, 'menu-management', 50, '菜单').subscribe(
        (assetsInfo: any) => { // 获取菜单id
          if (assetsInfo.length > 0) {
            this.assetType = assetsInfo[0].id;
            this.attributeService.getEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE).subscribe((menu) => {
              if (menu.length > 0) { // 获取资产里的菜单
                this.getDashboards(assetsInfo[0].customerId.id).subscribe(allowMenuData => { // 获取分配给客户的菜单列表
                  if (allowMenuData.data.length > 0) {
                    let menuList;
                    menu.forEach(item => {
                      if (item.key === 'menu') {
                        menuList = item.value;
                      } else if (item.key === 'theme') {
                        this.theme = item.value;
                      } else if (item.key === 'mobileHomepageDashboardID') {
                        this.mobileHomepageDashboardID = item.value;
                      } else if (item.key === 'mobileWorkbenchDashboardID') {
                        this.mobileWorkbenchDashboardID = item.value;
                      }
                    });
                    let newMenu = Object.values(menuList).map((item: MenuElement) => {
                      let i: MenuElement;
                      allowMenuData.data.forEach((each: any) => {
                        if (Object.prototype.toString.call(item?.dashboardId) === '[object Null]' || each.id.id === item.dashboardId) {
                          i = item;
                        }
                      })
                      return i;
                    });

                    this.originMenuData = newMenu.filter(Boolean); // 排除undefined
                    // 将menu转化为树
                    resolve(this.toTree(this.originMenuData));
                    this.fullBg = this.loopMenu(this.toTree(this.originMenuData));
                  }
                });
              }
            })
          }
        }
      );
    })
  }

  private loopMenu(menu: MenuElement[]): Array<FullBG> {
    let fullBg: Array<FullBG> = []
    menu.forEach(i => {
      if (i.isFullBg) {
        fullBg.push({
          dashboardId: i.dashboardId,
          name: i.name
        })
      }
      if (i.children && i.children.length > 0) {
        fullBg.push.apply(fullBg, this.loopMenu(i.children))
      }
    })
    return fullBg
  }

  public checkFullBg(tab: MenuElement) {
    for (let i = 0; i < this.fullBg.length; i++) {
      if (this.fullBg[i].dashboardId === tab.dashboardId) {
        this.isFullBg = true;
        break
      } else {
        this.isFullBg = false
      }
    }
  }

  private toTree(list: MenuElement[]) {
    if (!list) return;
    list = JSON.parse(JSON.stringify(list));

    let menu = [];
    let map = {};
    list.forEach(item => {
      item.children = [];
      map[item.name] = item;
      if (item.parentName === '0') {
        menu.push(item);
      } else {
        map[item.parentName] && map[item.parentName].children.push(item);
      }
    })

    return menu;
  }

  private getDashboards(customerId: string): Observable<PageData<DashboardInfo>> {
    const pageLink = new PageLink(100);
    let dashboardsObservable: Observable<PageData<DashboardInfo>>;
    const authUser = getCurrentAuthUser(this.store);
    if (authUser.authority === Authority.CUSTOMER_USER) {
      if (customerId && customerId !== NULL_UUID) {
        dashboardsObservable = this.dashboardService.getCustomerDashboards(customerId, pageLink,
          { ignoreLoading: true });
      } else {
        dashboardsObservable = of(emptyPageData());
      }
    } else {
      dashboardsObservable = this.dashboardService.getTenantDashboards(pageLink, { ignoreLoading: true });
    }
    return dashboardsObservable;
  }
  public toggleDefaultTab() {
    this.getMenuData().then((menu: MenuElement[]) => {
      if (menu.length > 0) {
        const defaultTab = menu[0].type === 'link' ? menu[0] : menu[0].children[0];
        this.clearTabList()
        this.handleClick(defaultTab);
      }
    })
  }
}
