import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FdKnowledgeTrainComponent } from "./knowledge/fd-knowledge-train.component";
import { BannerTopComponent } from "./banner-top/banner-top.component";
import { MainInfoComponent } from "./main-info/main-info.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { TabComponent } from "./tab/tab.component";
import { ImageInfoComponent } from "./image-info/image-info.component";
import { Type } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";
import { NgxEchartsModule } from "ngx-echarts";
import { NoticeInfoComponent } from "./notice-info/notice-info.component";
import { ExamChoiceComponent } from "./exam-choice/exam-choice.component";

const component: Type<any>[] = [
  FdKnowledgeTrainComponent,
  BannerTopComponent,
  MainInfoComponent,
  UserInfoComponent,
  TabComponent,
  ImageInfoComponent,
  NoticeInfoComponent,
  ExamChoiceComponent,
];

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
export class FdKnowledgeTrainModule {}
