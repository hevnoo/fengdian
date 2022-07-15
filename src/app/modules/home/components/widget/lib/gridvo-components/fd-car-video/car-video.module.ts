import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";
import { FenceManageComponent } from './fence-manage/fence-manage.component';
import { ModelAddEditComponent } from './fence-manage/model-add-edit/model-add-edit.component';
import { TrackComponent } from './track/track.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { PersonListComponent } from './person-list/person-list.component';
import { AlarmListComponent } from './alarm-list/alarm-list.component';
import { PersonManageComponent } from "./person-manage/person-manage.component";
import { PersonAddComponent } from "./person-manage/person-add/person-add.component";
import { WorkcardManageComponent } from './workcard-manage/workcard-manage.component';
import { CarListComponent } from "./car-list/car-list.component";
import { CarManageComponent } from "./car-manage/car-manage.component";
import { FenceListComponent } from "./fence-list/fence-list.component";

const CarVideoComponents = [
  FenceManageComponent,
  ModelAddEditComponent,
  TrackComponent,
  LeafletMapComponent,
  PersonListComponent,
  AlarmListComponent,
  PersonManageComponent,
  PersonAddComponent,
  WorkcardManageComponent,
  CarListComponent,
  CarManageComponent,
  FenceListComponent
]

@NgModule({
  // @ts-ignore
  declarations: [...CarVideoComponents],
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule,
  ],
  exports: [
    ...CarVideoComponents
  ]
})
export class CarVideoComponentModule { }
