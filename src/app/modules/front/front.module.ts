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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontRoutingModule } from './front-routing.module';
import { FrontComponent } from './front.component';
import { SharedModule } from '@app/shared/shared.module';
import { TabsComponent } from '@modules/front/tabs/tabs.component';
import { MenuComponent } from "@modules/front/menu/menu.component";
import { FrontComponentsModule } from "@modules/front/components/front-components.module";
import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { MessageComponent } from './message/message.component'
@NgModule({
  declarations:
    [
      FrontComponent,
      TabsComponent,
      MenuComponent,
      MenuItemComponent,
      MessageComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    FrontRoutingModule,
    FrontComponentsModule,
    NgZorroAntdModule
  ]
})
export class FrontModule { }
