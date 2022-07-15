import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";

import { PageComponent } from "@shared/components/page.component";
import { AppState } from "@core/core.state";
import { getCurrentAuthState } from "@core/auth/auth.selectors";
import { AuthState } from "@core/auth/auth.models";
import { MenuElement } from "@home/pages/admin/front-settings/front-settings.component";

import { TabsService } from "@app/core/services/tabs.service";

import { isMobile } from "@core/utils";
import { ThemeService } from "@core/services/theme.server";
import { GridvoUtilsService } from "@core/services/gridvo-utils.service";
import { GridvoMobileService } from "@core/services/gridvo-mobile.service";
@Component({
  selector: "tb-front",
  templateUrl: "./front.component.html",
  styleUrls: ["./front.component.scss"],
})
export class FrontComponent extends PageComponent implements OnInit, OnDestroy {
  routerLister$: Subscription = null;
  isShowBack$ = this.TabsService.isShowBack$;
  isMobile: boolean;
  authState: AuthState = getCurrentAuthState(this.store);
  isVisibleMessage: boolean = false;
  menu: MenuElement[]; // 菜单数据
  theme: string; // 主题
  isCollapsed: boolean = this.TabsService.collapse;

  collapse: boolean = this.TabsService.collapse;
  siderbarWidth: string = "230px";

  isGridvoChatApp: boolean;
  drawerVisible: boolean = false;

  currentTab: string[];

  isFullBg: boolean = this.TabsService.isFullBg;

  constructor(
    protected store: Store<AppState>,
    private router: Router,
    private TabsService: TabsService,
    private themeService: ThemeService,
    private untis: GridvoUtilsService,
    private GMService: GridvoMobileService
  ) {
    super(store);
    this.GMService.injectFn();
  }

  ngOnInit() {
    this.isGridvoChatApp = this.untis.isGridvoChatApp();
    this.isMobile = isMobile();
    this.listenRouterChange(); // 监听路由变化
    this.collapse
      ? (this.siderbarWidth = "230px")
      : (this.siderbarWidth = "80px");
    // 获取菜单数据
    this.TabsService.getMenuData().then((menu: MenuElement[]) => {
      if (menu.length > 0) {
        this.menu = menu;
        this.theme = this.TabsService.theme;
        this.themeService.setActiveTheme(this.theme);
        console.log("当前主题 :>> ", this.theme);
        const urlSegments = this.router.url.split("?");
        const idArr = urlSegments[0].split("/");
        let route: string;
        if (urlSegments.length > 1) {
          route = urlSegments[1].split("=")[1];
        }
        if (this.isGridvoChatApp && typeof route !== "undefined") {
          // 判断是否是isGridvoChatApp 并且有参数
          const tab: MenuElement = {
            name: "移动端页面",
            dashboardId: undefined,
          };
          if (route === "homepage") {
            tab.name = '首页';
            tab.dashboardId = this.TabsService.mobileHomepageDashboardID;
          } else if (route === "workbench") {
            tab.name = '工作台';
            tab.dashboardId = this.TabsService.mobileWorkbenchDashboardID;
          }
          this.TabsService.handleClick(tab);
        } else {
          const refreshTab = this.TabsService.originMenuData.filter(
            (item) => item.dashboardId === idArr[idArr.length - 1]
          );
          const defaultTab =
            this.menu[0].type === "link"
              ? this.menu[0]
              : this.menu[0].children[0];
          if (refreshTab.length <= 0) {
            if (idArr[idArr.length - 1].length === 36) {
              this.router.navigateByUrl(
                `front/dashboard/${idArr[idArr.length - 1]}`
              );
            } else {
              this.TabsService.handleClick(defaultTab);
            }
          } else {
            this.TabsService.handleClick(refreshTab[0]);
          }
          this.isFullBg = this.TabsService.isFullBg;
        }
      }
    });
    // console.log(this.themeService, 'serviceFront')
    this.currentTab = this.TabsService.currentTab;
  }
  ngOnDestroy() {
    this.routerLister$?.unsubscribe();
  }
  private listenRouterChange() {
    this.routerLister$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res: any) => {
        this.isFullBg = this.TabsService.isFullBg;
      });
  }

  isCollapsedEvent() {
    if (this.theme !== "huadian") this.TabsService.toggleCollapse();
    this.collapse = this.TabsService.collapse;
    this.siderbarWidth = this.siderbarWidth === "230px" ? "50px" : "230px";
  }

  tabClick(tab: MenuElement) {
    this.isFullBg = this.TabsService.isFullBg;
  }

  back() {
    this.TabsService.goBack();
  }
}
