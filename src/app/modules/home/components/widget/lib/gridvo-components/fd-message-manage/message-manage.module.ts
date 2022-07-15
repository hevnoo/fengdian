import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";
import { SendModelComponent } from "@home/components/widget/lib/gridvo-components/fd-message-manage/send-model/send-model.component"
import { ReserviceModelComponent } from '@home/components/widget/lib/gridvo-components/fd-message-manage/reservice-model/reservice-model.component'

const MessageManageComponents = [
  SendModelComponent,
  ReserviceModelComponent
]

@NgModule({
  // @ts-ignore
  declarations: [...MessageManageComponents],
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule,
  ],
  exports: [
    ...MessageManageComponents
  ]
})
export class MessageManageComponentModule { }
