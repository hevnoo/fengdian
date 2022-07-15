import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Type } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";
import { NgxEchartsModule } from "ngx-echarts";

import { TableComponent } from "./table/table.component";
import { AddComponent } from "./add/add.component";
import { ModifyComponent } from "./modify/modify.component";

const component: Type<any>[] = [TableComponent, AddComponent, ModifyComponent];

@NgModule({
  declarations: [
    // @ts-ignore
    ...component,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
  ],
  exports: [...component],
})
export class FdScheduleManageModule {}
