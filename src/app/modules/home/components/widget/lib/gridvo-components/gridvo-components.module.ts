import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared/shared.module";
import type { Type } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts"; // echarts;
import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";
import { CommonComponentsModule } from "@home/components/widget/lib/gridvo-components/common-components/common-components.module";

// 服务
import { DefectMamentService } from "@home/components/widget/lib/gridvo-components/fd-defect-manage/services/defect-manage.service";
import { CarVideoService } from "./common/services/car-video.service";

// gridvo自定义组件
import { HkVideoComponent } from "@gwhome/video/hk-video/hk-video.component";
import { RadarChartComponent } from "@home/components/widget/lib/gridvo-components/fd-radar-chart/radar-chart.component";
import { FdBarChartComponent } from "@home/components/widget/lib/gridvo-components/fd-bar-chart/fd-bar-chart.component";
import { FdRingChartComponent } from "@home/components/widget/lib/gridvo-components/fd-ring-chart/fd-ring-chart.component";
import { TableComponent } from "@home/components/widget/lib/gridvo-components/fd-table/table.component";
import { SearchButtonComponent } from "@home/components/widget/lib/gridvo-components/fd-searchButton/searchButton.component";
import { FdDefectMangeComponent } from "@home/components/widget/lib/gridvo-components/fd-defect-manage/fd-defect-manage.component";
import { FdFormDatePickerComponent } from "./fd-form-date-picker/fd-form-date-picker.component";
import { FdWindTurbineComponent } from "./fd-form-date-picker/fd-wind-turbine/fd-wind-turbine.component";
import { FdIndicativeInfoComponent } from "./fd-indicative-info/fd-indicative-info.component";
import { FdAnnouncementManageComponent } from "./fd-announcement-manage/fd-announcement-manage.component";
import { FdOtherStatisticsComponent } from "./fd-other-statistics/fd-other-statistics.component";
import { FdLiquidfillChartComponent } from "./fd-liquidfill-chart/fd-liquidfill-chart.component";
import { FdBarChartV2Component } from "./fd-bar-chart-v2/fd-bar-chart-v2.component";
import { FileManagementComponent } from "./file-management/file-management.component";
import { FdAnFormAddComponent } from "./fd-announcement-manage/fd-an-form-add/fd-an-form-add.component";
import { FdAnFormShowComponent } from "./fd-announcement-manage/fd-an-form-show/fd-an-form-show.component";
import { HikPluginVideoComponent } from "./video/hik-plugin-video/hik-plugin-video.component";
import { FdCarVideoComponent } from "./fd-car-video/fd-car-video.component";
import { CarVideoComponentModule } from "./fd-car-video/car-video.module";
import { FdWorkTickComponent } from "@home/components/widget/lib/gridvo-components/fd-work-tick/fd-work-tick.component";
import { FdTableComponent } from "@home/components/widget/lib/gridvo-components/fd-device-manage/fd-table.component";
import { ResumeChromicleComponent } from "./fd-resume-chromicle/fd-resume-chromicle.component";
import { CollasePanelComponent } from "./fd-resume-chromicle/collase-panel/collase-panel.component";
import { AddChromicleModelComponent } from "./fd-resume-chromicle/add-chromicle-model-component/add-chromicle-model.component";
import { ChangeChromicleModelComponent } from "./fd-resume-chromicle/change-chromicle-model/change-chromicle-model.component";
import { FdFrequentlyLinksComponent } from "./fd-frequently-links/fd-frequently-links.component";
import { DialogAddComponent } from "./fd-frequently-links/dialog/dialog-add/dialog-add.component";
import { DialogModifyComponent } from "./fd-frequently-links/dialog/dialog-modify/dialog-modify.component";
import { FdCaiTestComponent } from "./fd-cai-test/fd-cai-test.component";
import { RegularInspectionComponent } from "./fd-regular-inspection/fd-regular-inspection.component";
import { PdfReaderComponent } from "./pdf-reader/pdf-reader.component";

import { FdAlarmRecordComponent } from "./fd-alarm-record/fd-alarm-record.component";
import { FdAlarmTimePickerComponent } from "./fd-alarm-record/fd-alarm-time-picker/fd-alarm-time-picker.component";
import { FdAlarmLevelComponent } from "./fd-alarm-record/fd-alarm-level/fd-alarm-level.component";
import { FdDeviceDialogComponent } from "./fd-alarm-record/fd-device-dialog/fd-device-dialog.component";
import { ViewDetailsComponent } from "./fd-regular-inspection/view-details/view-details.component";
import { AddInspectionComponent } from "./fd-regular-inspection/add-inspection/add-inspection.component";
import { FdAbnormalSoundMonitoringComponent } from "@home/components/widget/lib/gridvo-components/fd-abnormal-sound-monitoring/fd-abnormal-sound-monitoring";
import { HistoricalDataComponent } from "@home/components/widget/lib/gridvo-components/fd-abnormal-sound-monitoring/historical-data/historical-data.component";
import { DefectManagementComponent } from "./defect-management/defect-management.component";
import { DetailDialogComponent } from "./defect-management/detail-dialog/detail-dialog.component";
import { ApproveDialogComponent } from "./defect-management/approve-dialog/approve-dialog.component";
import { MyWorkOrderComponent } from "./my-work-order/my-work-order.component";
import { FailureAnalysisReportComponent } from "./failure-analysis-report/failure-analysis-report.component";
import { AddReportComponent } from "./failure-analysis-report/add-report/add-report.component";
import { MessageManageComponentModule } from "@home/components/widget/lib/gridvo-components/fd-message-manage/message-manage.module";
//app

import { FdTowerVibrateComponent } from "./fd-tower-vibrate/fd-tower-vibrate.component";
import { FdSwingTrackChartComponent } from "./fd-tower-vibrate/fd-swing-track-chart/fd-swing-track-chart.component";
import { FdSwingRoseChartComponent } from "./fd-tower-vibrate/fd-swing-rose-chart/fd-swing-rose-chart.component";
import { FdMeasuringPointChartComponent } from "./fd-tower-vibrate/fd-measuring-point-chart/fd-measuring-point-chart.component";
import { FdTowerVibrateHeaderComponent } from "./fd-tower-vibrate/fd-tower-vibrate-header/fd-tower-vibrate-header.component";
import { FdMeasuringTableComponent } from "./fd-tower-vibrate/fd-measuring-table/fd-measuring-table.component";
import { FdTowerSearchComponent } from "./fd-tower-vibrate/fd-tower-search/fd-tower-search.component";
import { FdMonitorTableComponent } from "./fd-tower-vibrate/fd-monitor-table/fd-monitor-table.component";
import { FdMeasuringLineChartComponent } from "./fd-tower-vibrate/fd-measuring-line-chart/fd-measuring-line-chart.component";
import { FdMeasuringLineChartGroupComponent } from "./fd-tower-vibrate/fd-measuring-line-chart-group/fd-measuring-line-chart-group.component";
import { FdTrendCompareComponent } from "./fd-tower-vibrate/fd-trend-compare/fd-trend-compare.component";
import { FdScatterChartComponent } from "./fd-tower-vibrate/fd-scatter-chart/fd-scatter-chart.component";
import { FdSimpleBlockComponent } from "./fd-tower-vibrate/fd-simple-block/fd-simple-block.component";
import { FdAppProcessWorkOrderComponent } from "@home/components/widget/lib/gridvo-components/fd-app-defect-manage/fd-app-process-work-order/fd-app-process-work-order.component";
import { FdAppDefectReportComponent } from "@home/components/widget/lib/gridvo-components/fd-app-defect-manage/fd-app-defect-report/fd-app-defect-report.component";
import { FdAppDataMonitoringComponent } from "./app-production-daily/app-data-monitoring/app-data-monitoring.component";
import { FdAppLineChartComponent } from "./app-production-daily/app-line-chart/app-line-chart.component";
import { FdAppTop10RankComponent } from "./app-production-daily/app-top10-rank/app-top10-rank.component";
import { FdAppDailyWorkComponent } from "./app-production-daily/app-daily-work/app-daily-work.component";
import { FdAppDatePickerComponent } from "./app-production-daily/app-date-picker/app-date-picker.component";
import { FdKnowledgeTrainModule } from "./fd-knowledge-train/fd-knowledge-train.module";
import { FdAppMyDealtComponent } from "@home/components/widget/lib/gridvo-components/fd-app-defect-manage/fd-app-my-dealt/fd-app-my-dealt.component";
import { FdAppWorkTicketComponent } from "./app-work-ticket/app-work-ticket.component";
import { FdFengjiHeaderComponent } from "./fd-fengji-showdata/fd-fengji-header/fd-fengji-header.component";
import { FdFengjiMatrixComponent } from "./fd-fengji-showdata/fd-fengji-matrix/fd-fengji-matrix.component";
import { FdFengjiSelfComponent } from "./fd-fengji-showdata/fd-fengji-self/fd-fengji-self.component";
import { AppDateSwitchComponent } from "./app-date-switch/app-date-switch.component";
import { FdAppRemoteAssistanceComponent } from "./app-remote-assistance/app-remote-assistance.component";
import { FdAppWindTurbineSelectComponent } from "./app-windTurbine-select/app-windTurbine-select.component";
import { AppWindConditionMonitorComponent } from "./app-wind-condition-monitor/app-wind-condition-monitor.component";
import { AppWindInfoComponent } from "./app-wind-condition-monitor/app-wind-info/app-wind-info.component";
import { FdScheduleManageModule } from "./fd-schedule-manage/fd-schedule-manage.module";
import { FdMessageManageComponent } from "./fd-message-manage/fd-message-manage.component";
import { FdShakingCurveComponent } from "./fd-shaking-curve/fd-shaking-curve.component";
import { FdShakingChartComponent } from "./fd-shaking-curve/fd-shaking-chart/fd-shaking-chart.component";
import { DataFraudComponent } from "./data-fraud/data-fraud.component";
import { FdAppIndexAnalysisFooterComponent } from "./app-indexAnalysis-footer/app-indexAnalysis-footer.component";
import { AppAnnouncementDetailsComponent } from "./app-announcement-details/app-announcement-details.component";
import { FdRealTimeChartComponent } from "./fd-realTime-chart/fd-realTime-chart.component";
import { AppHomeCardComponent } from "./app-home-card/app-home-card.component";
/**
 * @description: 自定义微件封装为一个模块导入
 * @param {*}
 * @return {*}
 */
const gridvoWidgets: Type<any>[] = [
  HkVideoComponent,
  RadarChartComponent,
  FdBarChartComponent,
  FdRingChartComponent,
  TableComponent,
  SearchButtonComponent,
  FdDefectMangeComponent,
  FdFormDatePickerComponent,
  FdWindTurbineComponent,
  FdIndicativeInfoComponent,
  FdAnnouncementManageComponent,
  FdOtherStatisticsComponent,
  FdLiquidfillChartComponent,
  FdBarChartV2Component,
  FileManagementComponent,
  FdCarVideoComponent,
  FdAnFormAddComponent,
  FdAnFormShowComponent,
  HikPluginVideoComponent,
  FdTableComponent,
  ResumeChromicleComponent,
  CollasePanelComponent,
  AddChromicleModelComponent,
  ChangeChromicleModelComponent,
  FdWorkTickComponent,
  DialogAddComponent,
  DialogModifyComponent,
  FdFrequentlyLinksComponent,
  RegularInspectionComponent,
  FdCaiTestComponent,
  FdAbnormalSoundMonitoringComponent,
  FdAlarmRecordComponent,
  FdAlarmTimePickerComponent,
  FdAlarmLevelComponent,
  FdDeviceDialogComponent,
  ViewDetailsComponent,
  AddInspectionComponent,
  HistoricalDataComponent,
  DefectManagementComponent,
  DetailDialogComponent,
  ApproveDialogComponent,
  MyWorkOrderComponent,
  FailureAnalysisReportComponent,
  AddReportComponent,
  FdAppProcessWorkOrderComponent,
  FdAppDefectReportComponent,
  FdTowerVibrateComponent,
  FdSwingTrackChartComponent,
  FdSwingRoseChartComponent,
  FdMeasuringPointChartComponent,
  FdTowerVibrateHeaderComponent,
  FdMeasuringTableComponent,
  FdTowerSearchComponent,
  FdMonitorTableComponent,
  FdMeasuringLineChartComponent,
  FdMeasuringLineChartGroupComponent,
  FdTrendCompareComponent,
  FdScatterChartComponent,
  FdSimpleBlockComponent,
  FdAppDataMonitoringComponent,
  FdAppLineChartComponent,
  FdAppDailyWorkComponent,
  FdAppDatePickerComponent,
  FdAppTop10RankComponent,
  FdAppMyDealtComponent,
  FdMessageManageComponent,
  FdAppWorkTicketComponent,
  FdFengjiHeaderComponent,
  FdFengjiMatrixComponent,
  FdFengjiSelfComponent,
  FdAppRemoteAssistanceComponent,
  AppDateSwitchComponent,
  FdAppWindTurbineSelectComponent,
  AppWindConditionMonitorComponent,
  AppWindInfoComponent,
  FdShakingCurveComponent,
  FdShakingChartComponent,
  DataFraudComponent,
  FdAppIndexAnalysisFooterComponent,
  PdfReaderComponent,
  AppAnnouncementDetailsComponent,
  FdRealTimeChartComponent,
  AppHomeCardComponent,
];

@NgModule({
  providers: [DefectMamentService, CarVideoService],
  declarations: [
    // @ts-ignore
    ...gridvoWidgets,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    CommonComponentsModule,
    CarVideoComponentModule,
    FdKnowledgeTrainModule,
    MessageManageComponentModule,
    FdScheduleManageModule,
  ],
  exports: [
    ...gridvoWidgets,
    CommonComponentsModule,
    FdKnowledgeTrainModule,
    FdScheduleManageModule,
  ],
})
export class GridvoWidgetsModule {}
