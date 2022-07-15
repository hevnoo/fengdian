import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { WidgetContext } from '@home/models/widget-component.models';
import { WidgetConfig } from '@shared/models/widget.models';
import { CarVideoService, IStaff } from "../common/services/car-video.service";
import { PersonListComponent } from "./person-list/person-list.component";
import { CarListComponent } from "./car-list/car-list.component";
import { LeafletMapComponent } from "./leaflet-map/leaflet-map.component";
import { cloneDeep } from 'lodash';

@Component({
  selector: 'tb-fd-car-video',
  templateUrl: './fd-car-video.component.html',
  styleUrls: ['./fd-car-video.component.scss']
})
export class FdCarVideoComponent implements OnInit {
  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
  @ViewChild("personList", { static: true }) personList: PersonListComponent;
  @ViewChild("CarListComponent", { static: true }) CarListComponent: CarListComponent;
  @ViewChild("LeafletMap", { static: true }) LeafletMap: LeafletMapComponent;
  isLeftMenuShow: boolean = true;

  staffList: IStaff[] = [];
  carList: any[] = [];
  nodes: NzTreeNodeOptions[] = [
    {
      title: '人车监控设置',
      key: '1',
      children: [
        {
          title: '人员管理',
          key: 'person',
          isLeaf: true
        },
        {
          title: '车辆管理',
          key: 'car',
          isLeaf: true
        },
        {
          title: '工卡管理',
          key: 'card',
          isLeaf: true
        },
        {
          title: '电子围栏管理',
          key: 'fence',
          isLeaf: true
        },
      ]
    }
  ];

  cardAliasName: string;
  carAliasName: string;
  orientatorAliasName: string;
  constructor(private CarVideoService: CarVideoService) { }

  ngOnInit(): void {
    this.ctx.$scope.CarVideoWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
  }

  private initWidgetConfig() {
    this.CarVideoService.assetID = this.widgetConfig.settings.assetID;
    const key = this.widgetConfig.settings.staffKey;
    this.carAliasName = this.widgetConfig.settings.carAliasName;
    this.cardAliasName = this.widgetConfig.settings.cardAliasName;
    this.orientatorAliasName = this.widgetConfig.settings.orientatorAliasName;
    if (typeof (this.CarVideoService.assetID) !== 'undefined' && typeof (key) !== 'undefined') {
      this.CarVideoService.loadStaffList(this.CarVideoService.assetID, key).then((staffs: IStaff[]) => {
        this.staffList = staffs;
        this.handleTelemetryData(this.ctx?.data);
      });
    }
  }
  public onDataUpdated() {
    this.handleTelemetryData(this.ctx?.data);
  }
  handleTelemetryData(telemetryData) {
    if (telemetryData.length <= 0) return;
    const result = this.handletelemetryDataByAliasName(this.ctx.data);
    console.log('订阅的数据 :>> ', result);
    const workCardList = result[this.cardAliasName];
    const carList = result[this.carAliasName];
    const orientator = result[this.orientatorAliasName];
    orientator?.forEach(or => {
      or.active = or.active === 'false' ? '离线' : '在线';
    })
    carList?.forEach(item => {
      orientator?.forEach(or => {
        if (item.orientatorId === or.entityId) {
          item.orientator = or;
          item.id = item.entityId;
        }
      })
    });
    this.CarVideoService.workCardList$.next(workCardList);
    this.CarVideoService.carList = carList;
    this.CarVideoService.orientatorList$.next(orientator);
    this.carList = carList;

    if(this.staffList.length > 0) {
      this.staffList.forEach((item) => {
        const card: any = workCardList.filter((c: any) => c.cardcode === item.workCard);
        if(card.length > 0) {
          item.isWorkCardActive = card[0].active === 'false'? '离线' : '在线';
          item.workCardEntityId = card[0].entityId;
        }
      });
      this.CarVideoService.staffList = this.staffList;
      this.CarVideoService.staffList$.next(this.CarVideoService.staffList);
      // 这个组件列表需实时更新工卡是否在线
      this.personList.onWorkCardUpdated(this.CarVideoService.staffList);
    };
    // 遥测数据更新 人员或者车辆也要更新位置信息
    this.LeafletMap.onWorkCardUpdated(workCardList);
    this.LeafletMap.onCarUpdated(carList);
    // 这个组件需实时更新车辆是否在线
    this.CarListComponent.onCarUpdated(carList);
  }

  toggleLeftMenu() {
    this.isLeftMenuShow = !this.isLeftMenuShow;
    setTimeout(() => {
      this.LeafletMap.map.invalidateSize(true);
    }, 16);
  }
  handleTreeClick(e) {
    switch (e.node.key) {
      case 'fence':
        this.CarVideoService.isFenceTableVisible$.next(true);
        break;
      case 'person':
        this.CarVideoService.isPersonManageVisible$.next(true);
        break;
      case 'card':
        this.CarVideoService.isWorkCardManageVisible$.next(true);
        break;
      case 'car':
        this.CarVideoService.isCarManageVisible$.next(true);
        break;
      default:
        break;
    }
  }

  // 轨迹
  getTrack(info){
    this.LeafletMap.queryTrack(info);
  }
  // 人员列表勾选的列表
  staffOfCheckedId(ids: number[]) {
    this.LeafletMap.staffOfCheckedId(ids);
  }
  // 车辆列表勾选的列表
  carOfCheckedId(ids: number[]) {
    this.LeafletMap.carOfCheckedId(ids);
  }
  // 地图区域
  mapRegion(fenceInfo) {
    this.LeafletMap.mapRegion(fenceInfo);
  }

  // 处理遥测数据
  private handletelemetryDataByAliasName(telemetryData) {
    let result = {};
    telemetryData.forEach((item: any) => {
      let aliasName = item.datasource.aliasName;
      let entityId = item.datasource.entityId;
      let key = item.dataKey.name;
      let value = item.data[0] && item.data[0][1];
      if(typeof(result[aliasName]) === 'undefined') {
        result[aliasName] = [];
        result[aliasName].push({
          [key]: value,
          entityId: entityId
        })
      } else {
        const ids = result[aliasName].findIndex(item => item.entityId === entityId);
        if(ids > -1) {
          result[aliasName][ids][key] = value;
        } else {
          result[aliasName].push({
            [key]: value,
            entityId: entityId
          })
        }
      }
    });
    return result;
  }
}
