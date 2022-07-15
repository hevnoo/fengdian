///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { PageComponent } from '@shared/components/page.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HasConfirmForm } from '@core/guards/confirm-on-exit.guard';
import { DashboardService } from '@core/http/dashboard.service';
import { HomeDashboardInfo } from '@shared/models/dashboard.models';
import { isDefinedAndNotNull } from '@core/utils';
import { DashboardId } from '@shared/models/id/dashboard-id';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeService } from '@core/services/theme.server';
import { themeList } from "@home/components/widget/lib/gridvo-components/theme";
import { AssetService } from '@core/http/asset.service';
import { AttributeService } from '@core/http/attribute.service';
import { AttributeScope } from '@shared/models/telemetry/telemetry.models';
import { TabsService } from '@app/core/services/tabs.service';
import { LoginPageStyleService, loginStyleTypeEnum, LoginStyleType, loginStyleList } from '@app/core/http/login-page-style.service';
import { ActionNotificationShow } from '@app/core/notification/notification.actions';
@Component({
  selector: 'tb-home-settings',
  templateUrl: './home-settings.component.html',
  styleUrls: ['./home-settings.component.scss', './settings-card.scss']
})
export class HomeSettingsComponent extends PageComponent implements OnInit, HasConfirmForm {
  themeList = themeList
  homeSettings: FormGroup;
  themeValue: string;
  assetType: any = {
    entityType: 'ASSET',
    id: null
  }

  loginStyleList: Array<LoginStyleType> = loginStyleList
  loginStyleForm: FormGroup = this.fb.group({}) // change
  isImageList: string[] = [] // change


  constructor(protected store: Store<AppState>,
    private router: Router,
    private dashboardService: DashboardService,
    public fb: FormBuilder,
    private themeService: ThemeService,
    private message: NzMessageService,
    private assetService: AssetService,
    private attributeService: AttributeService,
    private TabsService: TabsService,
    private loginStyleServe: LoginPageStyleService) {
    super(store);
    this.loopLoginStyleList()
  }

  ngOnInit() {
    this.homeSettings = this.fb.group({
      dashboardId: [null],
      hideDashboardToolbar: [true]
    });
    this.dashboardService.getTenantHomeDashboardInfo().subscribe(
      (homeDashboardInfo) => {
        this.setHomeDashboardInfo(homeDashboardInfo);
      } 
    );

    // 获取主题
    this.themeValue = this.TabsService.theme;
    // 获得登录页样式配置
    this.getLoginStyle()

  }
  save(): void {
    const strDashboardId = this.homeSettings.get('dashboardId').value;
    const dashboardId: DashboardId = strDashboardId ? new DashboardId(strDashboardId) : null;
    const hideDashboardToolbar = this.homeSettings.get('hideDashboardToolbar').value;
    const homeDashboardInfo: HomeDashboardInfo = {
      dashboardId,
      hideDashboardToolbar
    };
    this.dashboardService.setTenantHomeDashboardInfo(homeDashboardInfo).subscribe(
      () => {
        this.setHomeDashboardInfo(homeDashboardInfo);
      }
    );

  }

  confirmForm(): FormGroup {
    return this.homeSettings;
  }

  private setHomeDashboardInfo(homeDashboardInfo: HomeDashboardInfo) {
    this.homeSettings.reset({
      dashboardId: homeDashboardInfo?.dashboardId?.id,
      hideDashboardToolbar: isDefinedAndNotNull(homeDashboardInfo?.hideDashboardToolbar) ?
        homeDashboardInfo?.hideDashboardToolbar : true
    });
  }
  toggleTheme() {
    this.assetService.findByName("menu-management").subscribe(
      (info) => {
        if (info) {
          this.assetType.id = info.id.id;
          const payload = [{
            key: 'theme',
            value: this.themeValue
          }];
          this.attributeService.saveEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE, payload).subscribe(
            () => {
              localStorage.setItem("themeValue", this.themeValue)
              this.themeService.setActiveTheme(localStorage.getItem("themeValue"));
              this.message.success(`保存成功,当前主题为 ${this.themeValue}`);
            }
          )
        }
      }
    );
  }

  // 循环loginStyleList，创建form，
  loopLoginStyleList() {  // change
    this.loginStyleList.forEach((item: LoginStyleType) => {
      this.loginStyleForm.addControl(item.formControlName, this.fb.control(""))
      if (item.type === loginStyleTypeEnum.IMAGE) {
        this.isImageList.push(item.formControlName)
      }
    })
  }

  // 获取loginStyle信息
  getLoginStyle() {
    this.loginStyleServe.getLoginStyle("loginStyleSettings").subscribe(res => {
      let obj = {}
      Object.keys(res).forEach(key => {
        if (this.isImageList.includes(key)) {
          res[key] && res[key].content ? obj[key] = res[key].prefix + ',' + res[key].content : null
        } else {
          obj[key] = res[key]
        }
      })
      this.loginStyleForm.patchValue(obj, { emitEvent: true })
    })
  }

  // 保存登录页自定义样式
  saveLoginStyle() {
    // 如果是image的话，要把base64前缀分开 change
    const fetchValue = { label: "loginStyleSettings", ...this.loginStyleForm.value }
    Object.keys(fetchValue).forEach((key) => {
      if (this.isImageList.includes(key)) {
        fetchValue[key] = fetchValue[key] ? this.base64ImageStringSplit(fetchValue[key], ",") : null
      }
    })
    this.loginStyleServe.saveLoginStyleSettings(fetchValue).subscribe(res => {
      this.store.dispatch(new ActionNotificationShow({ message: '保存成功', type: 'success', duration: 500 }));
    })
  }

  // 处理base64图片, 返回一个对象，返回格式是请求接口规定的数据格式
  base64ImageStringSplit(str: string, symbol: string): { prefix: string, content: string } {
    const stringArr = str.split(symbol);
    return { prefix: stringArr[0], content: stringArr[1] }
  }
}

