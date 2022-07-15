import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";

import { DecResumeDialogComponent } from "./device-resume-dialog/device-resume-dialog.component";
import { DialogTableComponent } from "./device-resume-dialog/component/dialog-table/dialog-table.component";
import { DialogSearchButtonComponent } from "./device-resume-dialog/component/dialog-search-button/dialog-search-button.component";
import { FormComponent } from "@home/components/widget/lib/gridvo-components/fd-defect-manage/fd-form/form.component";
import { GroupSelectBlockComponent } from "./group-select-block/group-select-block.component";
import { DevicePropertiesComponent } from './device-resume-dialog/device-properties/device-properties.component';
import { TelemetryPropertiesComponent } from './device-resume-dialog/telemetry-properties/telemetry-properties.component';
import { ChronicleComponent } from './device-resume-dialog/chronicle/chronicle.component';
import { DefectComponent } from './device-resume-dialog/defect/defect.component';
import { FdAppInputSearchComponent } from './app-input-search/input-search.component'

import { DeviceOtherInformationComponent } from './device-resume-dialog/device-properties/device-other-information/device-other-information.component'
import { SwitchComponent } from './device-resume-dialog/device-properties/device-other-information/switch-component/switch.component'
import { SelectComponent } from './device-resume-dialog/device-properties/device-other-information/select-component/select.component'
import { NumberComponent } from './device-resume-dialog/device-properties/device-other-information/number-component/number.component'
import { InputComponent } from "./device-resume-dialog/device-properties/device-other-information/input-component/input.component";
import { DateTimeComponent } from "./device-resume-dialog/device-properties/device-other-information/datetime-copmpone/datetime.component";
import { SelectDeviceComponent } from "./select-device/select-device.component";
import { SliderSwitchComponent } from './slider-switch/slider-switch.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NavigationComponent } from "./navigation/navigation.component";
import { NoticeBarComponent } from "./notice-bar/notice-bar.component";
import { BaseChartComponent } from './base-chart/base-chart.component';
import { FrequentlyLinksComponent } from "./frequently-links/frequently-links.component";
const FrontComponents = [
  DecResumeDialogComponent,
  DialogTableComponent,
  DialogSearchButtonComponent,
  FormComponent,
  GroupSelectBlockComponent,
  DevicePropertiesComponent,
  TelemetryPropertiesComponent,
  ChronicleComponent,
  DefectComponent,
  DeviceOtherInformationComponent,
  SwitchComponent,
  SelectComponent,
  NumberComponent,
  InputComponent,
  DateTimeComponent,
  SelectDeviceComponent,
  SliderSwitchComponent,
  CarouselComponent,
  NavigationComponent,
  NoticeBarComponent,
  FdAppInputSearchComponent,
  BaseChartComponent,
  FrequentlyLinksComponent
]

@NgModule({
  // @ts-ignore
  declarations: [...FrontComponents ],
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule
  ],
  exports: [
    ...FrontComponents
  ]
})
export class CommonComponentsModule { }
