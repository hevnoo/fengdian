import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { PageComponent } from '@shared/components/page.component';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DeviceService } from '@app/core/http/device.service';
import { EntityType } from '@shared/models/entity-type.models';
import { AttributeService } from '@core/http/attribute.service';
import { AttributeScope } from '@shared/models/telemetry/telemetry.models';

import { PositionMatrix, ILnglat, ISettingsObj } from "./position-matrix.module";
import { createPanelMatrix, getCatesian3FromPX } from "./utils/index";
import { DrawPoint } from "./utils/polyline";
import { NzModalService } from 'ng-zorro-antd/modal';
interface IModelMatrixSettings {
  lng: number;
  lat: number;
  alt: number;
  scale: number;
  heading: number;
  pitch: number;
  roll: number;
  pcs: number;
  spacing: number;
  incline: number;
  slope: number;
  pcs2: number;
  spacing2: number;
  incline2: number;
  slope2: number;
}
interface ICameraPosInfo {
  lng: number;
  lat: number;
  alt: number;
  head: number;
  pitch: number;
  roll: number;
}

interface ILineSetting {
  clampToGround: boolean;
  material: string;
  width: number;
}
interface IClickEntityId {
  entity: any;
  color: string;
}
const Cesium = (window as any).Cesium;
@Component({
  selector: 'tb-position-matrix',
  templateUrl: './position-matrix.component.html',
  styleUrls: ['./position-matrix.component.scss']
})
export class PositionMatrixComponent extends PageComponent implements OnInit, AfterViewInit, OnDestroy {
  container: JQuery<HTMLElement>;
  PositionMatrix: any; // 全景图实例
  modelCollection: any = new Cesium.PrimitiveCollection(); // 模型实例
  instanceidWraper: JQuery<HTMLElement>;
  clickId: string; // 点击模型的id
  clickLnglat: ILnglat = {
    lng: 0,
    lat: 0,
    alt: 0
  };  // 经纬度
  visible: boolean = false;
  settingsObj: ISettingsObj = {
    tilesUrl: '', // 瓦片地址
    modelUrl: '', // 模型地址
  };
  modelMatrixSettings: IModelMatrixSettings = {
    lng: 117.33525770751684,
    lat: 26.013824564559765,
    alt: 270,
    scale: 0.001,
    heading: -25,
    pitch: 2,
    roll: 15,

    pcs: 30, // 个数
    spacing: 0.0000098, // 间距
    incline: 0.0000055, // 倾斜量
    slope: 0, // 坡度

    pcs2: 1,
    spacing2: -0.0000116,
    incline2: 0.000017,
    slope2: 0.51,
  }

  // 创建设备
  isVisible: boolean = false;
  label: string;
  deviceProfileId: string;
  createNum: number = 0;
  isCreating: boolean = false;

  // 相机tabs
  cameraPosInfo: ICameraPosInfo = {
    lng: undefined,
    lat: undefined,
    alt: undefined,
    head: undefined,
    pitch: undefined,
    roll: undefined,
  }

  // 点线面
  DrawPoint: any; // 实例
  allPointKeyArr: string; // 所有点集合
  linePointKeyArr: string; // 当前线点位集合
  copyPointsArr: string; // 复制点集合
  pointsMap: Map<string, any>;
  copyPoint: string = ''; // 复制点
  modifyAltWrap: JQuery<HTMLElement>;
  lineSetting: ILineSetting = {
    clampToGround: true,
    material: '#ffff00',
    width: 2,
  };
  bunchVisible: boolean = false;
  bunchName: string;
  bunchLabel: string;
  bunchDeviceProfileId: string;
  isCreatingBunch: boolean = false;
  clickEntityId: any = [];

  constructor(protected store: Store<AppState>,
    private message: NzMessageService,
    private deviceService: DeviceService,
    private attributeService: AttributeService,
    private modal: NzModalService) {
    super(store);
  }
  ngAfterViewInit() {
  }
  ngOnDestory() {
    this.PositionMatrix.viewer.destroy();
  }
  ngOnInit() {
    this.container = $("#positionContainer");
    this.instanceidWraper = $(".instanceid-wraper");
    this.modifyAltWrap = $(".modify-alt-wraper");
    const cesiumUtils = JSON.parse(localStorage.getItem('cesiumUtils'));
    this.settingsObj.tilesUrl = cesiumUtils.tilesUrl;
    this.settingsObj.modelUrl = cesiumUtils.modelUrl;
  }
  initConf() {
    if (Object.prototype.toString.call(this.PositionMatrix) === '[object Object]') {
      this.PositionMatrix.viewer.destroy();
    };
    this.PositionMatrix = new PositionMatrix(this.container, this.settingsObj);
    this.PositionMatrix.readyPromise().then((viewer) => {
      this.initClickEvent();
      this.initCameraChanged();
      this.DrawPoint = new DrawPoint({
        viewer,
        lineSetting: this.lineSetting,
        posCB: (map) => {
          this.pointsMap = map;
          const arr = [];
          map.forEach((item, key) => {
            arr.push(key);
          })
          this.allPointKeyArr = arr.toString();
        }
      });
    })
    // 保存配置到lacal
    const cesiumUtils = {
      modelUrl: this.settingsObj.modelUrl,
      tilesUrl: this.settingsObj.tilesUrl
    }
    localStorage.setItem('cesiumUtils', JSON.stringify(cesiumUtils));
  }

  createModels(allInstance) {
    for (let i = 0; i < allInstance.length; ++i) {
      const instance = allInstance[i];
      const modelMatrix = instance.modelMatrix;
      const model = Cesium.Model.fromGltf({
        url: this.settingsObj.modelUrl,
        modelMatrix: modelMatrix,
        id: instance.batchId,
      })
      this.modelCollection.add(model);
    }
    console.log('this.modelCollection :>> ', this.modelCollection);
    this.PositionMatrix.viewer.scene.primitives.add(this.modelCollection);
  }

  // 获取点击点的世界坐标（Cartesian3） 经纬度
  initClickEvent() {
    this.PositionMatrix.handler.setInputAction((movement) => {
      // 世界坐标
      const position = getCatesian3FromPX(movement.position, this.PositionMatrix.viewer);
      // 世界坐标转经纬度 
      var ellipsoid = this.PositionMatrix.viewer.scene.globe.ellipsoid;
      var cartographic = ellipsoid.cartesianToCartographic(position);
      var lng = Cesium.Math.toDegrees(cartographic.longitude);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var alt = cartographic.height;
      this.clickLnglat.lng = lng;
      this.clickLnglat.lat = lat;
      this.clickLnglat.alt = alt;

      //模型点击事件
      var pick = this.PositionMatrix.viewer.scene.pick(movement.position);
      if (pick.primitive instanceof Cesium.GroundPrimitive) { // 点击了Entity
        this.message.info(`当前点击实体为 ${pick.id.id}`);
        this.clickEntityId.push({
          entity: pick,
          color: pick.id.polygon.material.color.getValue().clone()
        })
        pick.id.polygon.material = Cesium.Color.fromCssColorString('#fc532f');
      } else if (Cesium.defined(pick) && pick.primitive instanceof Cesium.Label && pick.id?.includes('label')) { // 点击了 label
        // 保存该点位置信息
        let labels;
        this.pointsMap.forEach(item => {
          if (item.id === pick.id) labels = item;
        });
        if (labels instanceof Cesium.Label) {
          this.copyPoint = `${labels.position.toString().replace(/\(/g, '[').replace(/\)/g, ']')}`;
        };
        const Cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.PositionMatrix.viewer.scene, position);
        const x = Cartesian2.x - (this.modifyAltWrap.width()) / 2;
        const y = Cartesian2.y - (this.modifyAltWrap.height());
        this.modifyAltWrap.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
        this.clickId = pick.id;
        this.modifyAltWrap.show();
        $('.input-alt').focus();
        return;
      } else if (pick && pick.primitive instanceof Cesium.Model) { // 点击了模型
        const Cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.PositionMatrix.viewer.scene, position);
        const x = Cartesian2.x - (this.instanceidWraper.width()) / 2;
        const y = Cartesian2.y - (this.instanceidWraper.height());
        this.instanceidWraper.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
        this.clickId = pick.id;
        this.instanceidWraper.show();
        // $('.instance-input').val('');
        $('.instance-input').focus();
      } else if ((pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
        (pick && pick.primitive instanceof Cesium.Cesium3DTileset)) { // 点击了3Dtiles
        this.instanceidWraper.hide();
        this.modifyAltWrap.hide();
        this.clickId = undefined;
        if (this.clickEntityId.length > 0) { //点击了实体 要清除颜色
          this.clickEntityId.forEach(item => {
            item.entity.id.polygon.material = item.color;
          });
          this.clickEntityId.length = 0;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  useSettings() {
    if (!this.checkSettings()) return;
    if (this.modelCollection._primitives.length > 0) {
      this.modelCollection.removeAll();
    };
    const p1 = [
      {
        lng: Number(this.modelMatrixSettings.lng),
        lat: Number(this.modelMatrixSettings.lat),
        alt: Number(this.modelMatrixSettings.alt)
      }
    ];
    let spa = Number(this.modelMatrixSettings.spacing2);
    let inc = Number(this.modelMatrixSettings.incline2);
    let slo = Number(this.modelMatrixSettings.slope2);
    for (let i = 0; i < Number(this.modelMatrixSettings.pcs2); i++) {
      p1.push({
        lng: Number(this.modelMatrixSettings.lng) + spa,
        lat: Number(this.modelMatrixSettings.lat) + inc,
        alt: Number(this.modelMatrixSettings.alt) + slo,
      })
      spa += Number(this.modelMatrixSettings.spacing2);
      inc += Number(this.modelMatrixSettings.incline2);
      slo += Number(this.modelMatrixSettings.slope2);
    }
    const PanelMatrix = [];
    p1.forEach(item => {
      // @ts-ignore
      PanelMatrix.push(...createPanelMatrix(
        item,
        Number(this.modelMatrixSettings.spacing),
        Number(this.modelMatrixSettings.incline),
        Number(this.modelMatrixSettings.slope),
        Number(this.modelMatrixSettings.pcs)));
    })
    if (PanelMatrix.length <= 0) return;
    const instances = [];
    for (let i = 0; i < PanelMatrix.length; i += 1) {
      const position = Cesium.Cartesian3.fromDegrees(PanelMatrix[i].lng, PanelMatrix[i].lat, PanelMatrix[i].alt);
      const heading = Cesium.Math.toRadians(Number(this.modelMatrixSettings.heading));
      const pitch = Cesium.Math.toRadians(Number(this.modelMatrixSettings.pitch));
      const roll = Cesium.Math.toRadians(Number(this.modelMatrixSettings.roll));
      let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        new Cesium.HeadingPitchRoll(heading, pitch, roll)); // 旋转
      Cesium.Matrix4.multiplyByUniformScale(modelMatrix, Number(this.modelMatrixSettings.scale), modelMatrix); // 缩放
      instances.push({
        modelMatrix: modelMatrix,
        batchId: PanelMatrix[i].id
      });
    };
    console.log('instances :>> ', instances);
    this.createModels(instances);
  }
  private checkSettings() {
    let check: boolean;
    if (this.settingsObj.tilesUrl.toString() === '' ||
      this.settingsObj.modelUrl.toString() === ''
    ) {
      this.message.info('初始化配置不能为空');
      check = false;
    };
    if (this.modelMatrixSettings.lng.toString() === '' ||
      this.modelMatrixSettings.lat.toString() === '' ||
      this.modelMatrixSettings.alt.toString() === '' ||
      this.modelMatrixSettings.scale.toString() === '' ||
      this.modelMatrixSettings.heading.toString() === '' ||
      this.modelMatrixSettings.heading.toString() == '' ||
      this.modelMatrixSettings.pitch.toString() === '' ||
      this.modelMatrixSettings.roll.toString() === '' ||
      this.modelMatrixSettings.pcs.toString() === '' ||
      this.modelMatrixSettings.spacing.toString() === '' ||
      this.modelMatrixSettings.incline.toString() === '' ||
      this.modelMatrixSettings.slope.toString() === '' ||
      this.modelMatrixSettings.pcs2.toString() === '' ||
      Number(this.modelMatrixSettings.spacing2).toString() === '' ||
      this.modelMatrixSettings.incline2.toString() === '' ||
      this.modelMatrixSettings.slope2.toString() === ''
    ) {
      this.message.info('模型矩阵配置不能为空');
      check = false;
      return check;
    };
    check = true;
    return check;
  }

  close(): void {
    this.visible = false;
  }

  handleModifyId(modelId) {
    if (!modelId) return;
    this.modelCollection._primitives.forEach(item => {
      if (item.id == this.clickId) {
        item.id = modelId;
        this.clickId = undefined;
        item.color = Cesium.Color.RED;
        this.message.success('修改成功！')
        this.instanceidWraper.hide();
      }
    })
  }

  popconfirmCancel() {
    this.message.info('取消批量创建设备');
  }
  handleModelCancel() {
    this.isVisible = false;
    this.isCreating = false;
    this.message.info('取消批量创建设备');
  }

  popconfirmOk() {
    this.isVisible = true;
  }

  handleAddDevice() {
    try {
      this.isCreating = true;
      const promitives = this.modelCollection._primitives;
      const needCreate: number = promitives.length;
      for (let i = 0; i < needCreate; i += 1) {
        const device = {
          type: promitives[i].id,
          name: promitives[i].id,
          label: this.label,
          deviceProfileId: {
            entityType: EntityType.DEVICE_PROFILE,
            id: this.deviceProfileId
          },
          additionalInfo: {
            description: "",
            gateway: false,
            overwriteActivityTime: false
          },
          customerId: null
        };
        this.deviceService.saveDevice(device).subscribe(deviceInfo => {
          const entityId = deviceInfo.id;
          const modelPosition = [{
            key: 'modelPosition',
            value: Cesium.Matrix4.toArray(promitives[i].modelMatrix)
          }];
          this.attributeService.saveEntityAttributes(entityId, AttributeScope.SERVER_SCOPE,
            modelPosition).subscribe(res => {
              if (Object.prototype.toString.call(res) == '[object Array]') {
                this.createNum += 1;
                if (this.createNum === needCreate) {
                  this.isCreating = false;
                  this.isVisible = false;
                  this.createNum = 0;
                  this.message.success("已完成设备批量创建！");
                }
              }
            })
        })
      }
    } catch (error) {
      console.log('error :>> ', error);
      this.handleModelCancel();
    }
  }

  /**
   * @description: tabs 相机
   * @param {*}
   * @return {*}
   */
  private initCameraChanged() {
    this.PositionMatrix.viewer.scene.camera.changed.addEventListener(() => {
      // 获取 相机姿态信息
      const head = this.PositionMatrix.viewer.scene.camera.heading;
      const pitch = this.PositionMatrix.viewer.scene.camera.pitch;
      const roll = this.PositionMatrix.viewer.scene.camera.roll;
      // 获取位置 wgs84的地心坐标系，x,y坐标值以弧度来表示
      const position = this.PositionMatrix.viewer.scene.camera.positionCartographic; //with longitude and latitude expressed in radians and height in meters.
      const longitude = Cesium.Math.toDegrees(position.longitude);
      const latitude = Cesium.Math.toDegrees(position.latitude);
      const height = position.height;

      this.cameraPosInfo.lng = longitude;
      this.cameraPosInfo.lat = latitude;
      this.cameraPosInfo.alt = height;
      this.cameraPosInfo.head = head;
      this.cameraPosInfo.pitch = pitch;
      this.cameraPosInfo.roll = roll;
    })
  }

  /**
   * @description: 点线面
   * @param {*}
   * @return {*}
   */
  createPoint() {
    this.DrawPoint.startCreate();
  }
  destroyAll() {
    this.DrawPoint.destroyAll();
  }
  private _handlePointsArr(positions) {
    let p = [];
    positions.forEach(item => {
      p.push(item.toString());
    });
    this.copyPointsArr = `[${p.toString().replace(/\(/g, '[').replace(/\)/g, ']')}]`;
  }
  copied(str) {
    this.message.create('success', str);
  }
  createLine() {
    if (typeof (this.linePointKeyArr) === 'undefined') return;
    const positions = [];
    const pointsArr = this.linePointKeyArr.split(',').filter(Boolean);
    if (pointsArr.length <= 0) return;
    pointsArr.forEach(item => {
      this.DrawPoint.positions.forEach((cartesian, key) => {
        if (item === key) positions.push(cartesian.position);
      })
    });
    if (positions.length <= 0) return;
    this.DrawPoint.createLine(positions);
    this._handlePointsArr(positions); // 复制点集合
  }
  handleModifyAlt(alt) { //修改单个点的高度
    this.lineSetting.clampToGround = false;
    this.DrawPoint.handleModifyAlt({
      id: this.clickId,
      alt,
      ellipsoid: this.PositionMatrix.viewer.scene.globe.ellipsoid
    }, () => {
      this.createLine();
      this.message.success('修改高度成功！')
      this.modifyAltWrap.hide();
    });
  }
  handleDeletePoint() {
    this.DrawPoint.destroyOne(this.clickId, () => {
      this.message.success('删除成功！')
      this.modifyAltWrap.hide();
    });
  }
  handleCloseBunchModal() {
    this.bunchVisible = false;
    this.isCreatingBunch = false;
  }
  handleAddBunchDevice() {
    if (typeof (this.bunchLabel) === 'undefined' ||
      typeof (this.bunchDeviceProfileId) === 'undefined' ||
      typeof (this.bunchName) === 'undefined' ||
      typeof (this.copyPointsArr) === 'undefined') return;
    try {
      this.isCreatingBunch = true;
      const device = {
        type: this.bunchName,
        name: this.bunchName,
        label: this.bunchLabel,
        deviceProfileId: {
          entityType: EntityType.DEVICE_PROFILE,
          id: this.bunchDeviceProfileId
        },
        additionalInfo: {
          description: "",
          gateway: false,
          overwriteActivityTime: false
        },
        customerId: null
      };
      this.deviceService.saveDevice(device).subscribe(deviceInfo => {
        const entityId = deviceInfo.id;
        const modelPosition = [{
          key: 'modelPosition',
          value: this.copyPointsArr
        }];
        this.attributeService.saveEntityAttributes(entityId, AttributeScope.SERVER_SCOPE,
          modelPosition).subscribe(res => {
            if (Object.prototype.toString.call(res) == '[object Array]') {
              this.isCreatingBunch = false;
              this.bunchVisible = false;
              this.message.success("已完成设备创建！");
            }
          })
      })
    } catch (error) {
      console.log('error :>> ', error);
      this.handleCloseBunchModal();
    }
  }
}
