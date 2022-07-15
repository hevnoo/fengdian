import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { WidgetConfig } from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { Router } from '@angular/router';
import { DefectManagementService } from '@app/core/http/defect-management.service';
import { AuthState } from '@core/auth/auth.models';
import { getCurrentAuthState } from '@core/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { GridvoMobileService, CameraType } from "@core/services/gridvo-mobile.service";
import { isMobile } from "@core/utils";
import { NzMessageService } from 'ng-zorro-antd/message';
import { TabsService } from "@core/services/tabs.service";
interface IImg {
  img: string;
  name: string;
  dashboardId: string;
  count?: number;
}
interface ICount {
  name: string;
  count: number
}
/**
 * @description: 移动端导航栏组件
 * @param {*}
 * @return {*}
 */
@Component({
  selector: 'tb-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  authState: AuthState = getCurrentAuthState(this.store);
  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;

  imgArr: IImg[] = [];
  isNeedTitle: boolean = false;
  title: string;

  badge: ICount = {
    name: '我的待办',
    count: undefined
  };
  constructor(
    protected store: Store<AppState>, private router: Router,
    private ref: ChangeDetectorRef,
    private DefectManagementService: DefectManagementService,
    private GMService: GridvoMobileService,
    private message: NzMessageService,
    private TabsService: TabsService) { }

  ngOnInit(): void {
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
    
  }
  private initWidgetConfig() {
    this.imgArr = this.widgetConfig.settings.imgsArr;
    this.isNeedTitle = this.widgetConfig.settings.isNeedTitle === 'Y' ? true : false;
    this.title = this.widgetConfig.settings.menuTitle;
    const payload = `pageSize=10&page=0&userIds=${this.authState.authUser.userId}`
    this.DefectManagementService.getToDoWorkOrderList(payload).subscribe(res => {
      this.badge.count = res.totalElements;
      this.imgArr.forEach(item => {
        if (item.name === this.badge.name) {
          item.count = this.badge.count;
        } else {
          item.count = 0;
        }
      });
      console.log('this.imgArr :>> ', this.imgArr);
      this.ref.detectChanges();
    })
  }

  handleMenu(event, menu) {
    this.TabsService.handleClick(menu);
  }

  openCamera() {
    const subjection = this.GMService.openCamera(CameraType.album).subscribe({
      next: (res) => {
        $('.test').html(res);
      },
      error: (err) => {
        $('.test').html(err);
      },
      complete: () => {
        subjection?.unsubscribe();
      }
    })
  }

}
