import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject, BehaviorSubject, from } from "rxjs";

import { Store } from '@ngrx/store';
import { AppState } from '@app/core/core.state';
import { AttributeService } from '@core/http/attribute.service';
import { EntityId } from '@shared/models/id/entity-id';
import { AttributeScope } from '@shared/models/telemetry/telemetry.models';
import { NzMessageService } from 'ng-zorro-antd/message';
export interface IStaff {
  id: string | number;
  name: string;
  isStaff: string;
  company: string;
  enterTime: string;
  outTime: string;
  workCard: string;
  notes: string;
  phone?: number;
  isWorkCardActive?: string;
  layerObj?: any;
  workCardEntityId: string;
}
export interface IDrawData {
  coordinate: string;
  shape: string;
}
interface IOrientator {
  active: string;
  entityId: string;
  latitude: number;
  longitude: number;
  name: string;
  [key: string]: any;
}
interface IWorkCard {
  active: string;
  cardcode: string;
  entityId: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}
@Injectable({
  providedIn: 'root'
})
export class CarVideoService {
  isFenceTableVisible$ = new BehaviorSubject<boolean>(false); // 电子围栏
  isAddFenceVisible$ = new BehaviorSubject<boolean>(false); // 增加电子围栏
  isDrawFence$ = new BehaviorSubject<boolean>(false); // 是否显示画图
  drawData$ = new BehaviorSubject<IDrawData>(undefined); // 画图的点位信息
  isPersonManageVisible$ = new BehaviorSubject<boolean>(false); // 人员管理
  isWorkCardManageVisible$ = new BehaviorSubject<boolean>(false); // 工卡管理
  isCarManageVisible$ = new BehaviorSubject<boolean>(false); // 车辆管理

  staffList: IStaff[];
  staffList$ = new Subject<Array<IStaff>>();

  carList: any[] = [];
  
  workCardList$ = new BehaviorSubject<Array<IWorkCard>>([]);
  orientatorList$ = new BehaviorSubject<Array<IOrientator>>([]);
  
  assetID: string = undefined;
  assetType: any = {
    entityType: 'ASSET',
    id: this.assetID
  };
  key: string = undefined;

  fenceList: any[] =[];
  selectFenceList$ = new BehaviorSubject<Array<string>>([]);

  constructor(private store: Store<AppState>,
    private attributeService: AttributeService,
    private message: NzMessageService,) {
  }
  
  loadStaffList(assetID, key) {
    this.assetType.id = assetID;
    this.key = key;
    return new Promise(resolve => {
      this.attributeService.getEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE).subscribe(
        (serverScope) => {
          if (serverScope.length > 0) {
            const staff = serverScope.filter(item => item.key === key)[0];
            this.staffList = JSON.parse(JSON.stringify(Object.values(staff.value)[0]));
            this.staffList$.next(this.staffList);
            resolve(this.staffList);
          }
        }
      )
    })
  }

  addAndModifyStaff(staffInfo) {
    return new Promise(resolve => {
      const isExist = this.staffList.findIndex(item => item.id === staffInfo.id);
      isExist > -1 ? this.staffList.splice(isExist, 1, staffInfo) : this.staffList.push(staffInfo);
      this.changeStaff(resolve);
    })
  }

  deleteStaff(staffId) {
    return new Promise(resolve => {
      this.staffList.forEach((item, idx, arr) => {
        if(item.id === staffId) arr.splice(idx, 1);
      });
      this.changeStaff(resolve);
    })
  }

  unBindWorkCard(staffInfo: IStaff) {
    return new Promise(resolve => {
      this.staffList.forEach((item, idx, arr) => {
        if (item.id === staffInfo.id) {
          item.workCard = null;
        };
      });
      this.changeStaff(resolve);
    })
  }

  bindWorkCard(staffInfo: IStaff) {
    return new Promise(resolve => {
      this.staffList.forEach((item, idx, arr) => {
        if (item.id === staffInfo.id) {
          item.workCard = null;
        };
      });
      this.changeStaff(resolve);
    })
  }

  private changeStaff(resolve) {
    const payload = [{
      key: this.key,
      value: {
        staffs: this.staffList
      }
    }];
    this.attributeService.saveEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE, payload).subscribe(
      () => {
        this.message.success(`保存成功!`);
        this.loadStaffList(this.assetType.id, this.key);
        resolve(true);
      }
    )
  }
}
