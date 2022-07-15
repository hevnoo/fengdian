import { Component, OnInit, Input, DoCheck, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CarVideoService, IStaff } from "../../common/services/car-video.service";
import { EleFenceService } from "../../common/http/ele-fence.service";
import L from 'leaflet';
import { initTrackPlayback, handlePoints } from "./leaflet-map.module";
import "beautifymarker";
import "leaflet-draw";
import { cloneDeep, differenceBy } from "lodash";
import { EntityId } from '@shared/models/id/entity-id';
import { EntityType } from '@shared/models/entity-type.models';
import moment from 'moment';
import { GridvoUtilsService } from '@app/core/services/gridvo-utils.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment as env } from '@env/environment';
@Component({
  selector: 'tb-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafletMapComponent implements OnInit {

  map: L.Map;

  drawControl = undefined; // 画图实例

  eleFenceGroup = L.layerGroup(); // 电子围栏图层

  staffGroup = L.layerGroup();

  carGroup = L.layerGroup();

  workCardList: any;
  staffMarkers: any[] = [];  // markers集合
  stafftimer = null; // 人员切换闪烁

  carMarkers: any[] = [];  // markers集合
  cartimer = null; // 车辆切换闪烁

  entityId: EntityId = {
    entityType: EntityType.DEVICE,
    id: undefined
  }
  constructor(private CarVideoService: CarVideoService,
    private ref: ChangeDetectorRef,
    private modal: NzModalService,
    private EleFenceService: EleFenceService,
    private utils: GridvoUtilsService,
    private message: NzMessageService) { }

  ngOnInit(): void {
    // 初始化的时候 只加载地图就好
    this.initMap();
    this.CarVideoService.isDrawFence$.asObservable().subscribe(res => {
      if (res) {
        this.map.addControl(this.drawControl);
        this.map.removeLayer(this.eleFenceGroup);
      } else {
        this.map.removeControl(this.drawControl);
        this.map.addLayer(this.eleFenceGroup);
      }
    });
    this.subscribeSelectFenceList();
  }

  initMap() {
    const dev = `http://10.0.5.104:30561/map/2d/arcterrain/{z}/{x}/{y}.png`;
    const prod = `${window.location.origin}/map/2d/arcterrain/{z}/{x}/{y}.png`;
    const satellite = L.tileLayer(`${env.production ? prod : dev}`, {
      maxZoom: 17,
    })
    const baseMaps = {
      "卫星图": satellite,
    };
    const overlayMaps = {
      "人员": this.staffGroup,
      "车辆": this.carGroup,
      "电子围栏": this.eleFenceGroup,
    };

    this.map = L.map('gridvo-fd-map', {
      center: [26.342831883299894, 119.84002889126381],
      zoom: 13,
      preferCanvas: true, // 使用canvas模式渲染矢量图形 ,
      attributionControl: false,
      zoomControl: false,
      layers: [satellite, this.staffGroup, this.carGroup, this.eleFenceGroup]
    });

    const zoom = L.control.zoom({ position: 'bottomleft', zoomInTitle: '放大', zoomOutTitle: '缩小' });
    zoom.addTo(this.map);

    const layerControl = L.control.layers(baseMaps,
      overlayMaps, {
      position: 'bottomleft',
      collapsed: true,
    }).addTo(this.map);

    this.initLeafletDraw();
  }

  // 初始化画图
  initLeafletDraw() {
    L.drawLocal.draw = {
      toolbar: {
        actions: { title: "点击取消绘制", text: "取消" },
        finish: { title: "点击结束绘制", text: "结束" },
        undo: {
          title: "点击删除最后一个点",
          text: "删除最后一个点"
        },
        buttons: {
          polyline: "绘制路线",
          polygon: "绘制多边形围栏",
          rectangle: "绘制矩形围栏",
          circle: "绘制圆形围栏",
          marker: "绘制标记",
          circlemarker: "绘制圆形标记"
        }
      },
      handlers: {
        circle: {
          tooltip: { start: "点击地图并且拖动,开始绘制圆形围栏." },
          radius: "Radius"
        },
        circlemarker: {
          tooltip: { start: "点击地图,放置一个圆形标记" }
        },
        marker: {
          tooltip: { start: "点击地图,放置一个标记" }
        },
        polygon: {
          tooltip: {
            start: "点击地图,开始绘制多边形围栏",
            cont: "点击地图,绘制下一个点",
            end: "点击起点,可以结束绘制"
          }
        },
        polyline: {
          error:
            "<strong>Error:</strong> 形状边缘不能交叉!",
          tooltip: {
            start: "点击地图,开始绘制路线",
            cont: "点击地图,绘制下一个点",
            end: "点击起点,可以结束绘制"
          }
        },
        rectangle: {
          tooltip: { start: "Click and drag to draw rectangle." }
        },
        simpleshape: { tooltip: { end: "松开鼠标,可以结束绘制" } }
      }
    },
      L.drawLocal.edit = {
        toolbar: {
          actions: {
            save: { title: "Save changes", text: "Save" },
            cancel: {
              title: "Cancel editing, discards all changes",
              text: "Cancel"
            },
            clearAll: {
              title: "Clear all layers",
              text: "Clear All"
            }
          },
          buttons: {
            edit: "Edit layers",
            editDisabled: "No layers to edit",
            remove: "Delete layers",
            removeDisabled: "No layers to delete"
          }
        },
        handlers: {
          edit: {
            tooltip: {
              text: "Drag handles or markers to edit features.",
              subtext: "Click cancel to undo changes."
            }
          },
          remove: {
            tooltip: { text: "Click on a feature to remove." }
          }
        }
      };

    let editableLayers = new L.FeatureGroup();
    let options = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#f40',
            weight: 5
          }
        },
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          shapeOptions: {
            color: '#f40'
          }
        },
        circle: {
          shapeOptions: {
            color: "#f40",
            weight: 5
          }
        },
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        edit: false,
        remove: false
      }
    };
    // @ts-ignore
    this.drawControl = new L.Control.Draw(options);
    // @ts-ignore
    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      let drawData = handlePoints(e);
      let layer = e.layer;
      this.map.addLayer(layer);
      this.drawFinish(drawData, layer);
    });
  }
  drawFinish(drawData, layer) {
    this.modal.confirm({
      nzTitle: '<i>确认选点？</i>',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.CarVideoService.drawData$.next(drawData);
        console.log('画的数据>>', this.CarVideoService.drawData$.value);
        this.CarVideoService.isAddFenceVisible$.next(true);
        this.CarVideoService.isFenceTableVisible$.next(true);
        this.CarVideoService.isDrawFence$.next(false);
        this.map.removeControl(this.drawControl);
        this.map.removeLayer(layer);
        this.ref.markForCheck();
        this.ref.detectChanges();
      },
      nzCancelText: '重试',
      nzOnCancel: () => {
        this.map.removeLayer(layer);
      }
    });
  }

  // 开始轨迹回放
  queryTrack(info) {
    this.entityId.id = info.id;
    const payload = {
      keys: 'latitude,longitude',
      startTs: info.startTime,
      endTs: info.endTime
    }
    this.EleFenceService.getTrack(this.entityId, payload).subscribe(res => {
      if (!this.utils.isEmptyObject(res)) {
        const trackArr = this.handleTrackData(res);
        initTrackPlayback(info.type, this.map, trackArr);
      } else {
        console.log('res :>> ', res);
        this.message.info('暂无数据！');
      }
    })
  }
  private handleTrackData(data) {
    let trackArray = [];
    const formatDate = (temp) => moment(temp).format('YYYY-MM-DD hh:mm:ss');
    data.latitude.forEach(lat => {
      data.longitude.forEach(lng => {
        if (lat.ts == lng.ts) {
          let time = formatDate(lat.ts);
          let str = [Number(lat.value), Number(lng.value)].toString();
          let temp = {
            lat: Number(lat.value),
            lng: Number(lng.value),
            time: lat.ts / 1000,
            info: [
              { key: "时间:", value: time },
              { key: "经纬度", value: str }
            ]
          };
          trackArray.push(temp);
        }
      })
    });
    return trackArray;
  }

  // 电子围栏列表
  subscribeSelectFenceList() {
    this.CarVideoService.selectFenceList$.asObservable().subscribe(ids => {
      if (this.CarVideoService.fenceList.length > 0 && ids.length > 0) {
        const filterData = this.CarVideoService.fenceList.filter(item => {
          let s;
          ids.forEach(i => {
            if (item.id == i) s = item;
          })
          return s;
        })
        this.handleFenceGroup(filterData);
      } else {
        this.removeFenceLayer();
      }
    })
  }
  private removeFenceLayer() {
    this.eleFenceGroup.eachLayer(layer => {
      try {
        this.eleFenceGroup.removeLayer(layer)
      } catch (error) { }
    });
  }
  // 地图区域
  mapRegion(fenceInfo) {
    this.handleFenceGroup([fenceInfo]);
  }
  private handleFenceGroup(fenceArr) {
    const isAddEleFenceLayer = this.map.hasLayer(this.eleFenceGroup);
    if (!isAddEleFenceLayer) this.map.addLayer(this.eleFenceGroup);
    this.removeFenceLayer();
    fenceArr.forEach(item => {
      const fence = cloneDeep(item);
      fence.coordinate = JSON.parse(fence.coordinate);
      let desc = `
          围栏名称: ${fence.name}<br>
          围栏状态: ${fence.status}<br>
          告警类型: ${fence.type}<br>
          缓冲时间：${fence.stayedTime}秒
        `;
      if (fence.shape === "圆形围栏") {
        L.circle(fence.coordinate[0], {
          radius: fence.coordinate[1].radius,
          weight: 5
        })
          .addTo(this.eleFenceGroup)
          .bindPopup(desc);
      } else if (fence.shape === "多边形围栏") {
        L.polygon(fence.coordinate, {
          weight: 5
        })
          .addTo(this.eleFenceGroup)
          .bindPopup(desc);
      } else if (fence.shape === "线形围栏") {
        L.polyline(fence.coordinate, {
          smoothFactor: 5,
          weight: 5
        })
          .addTo(this.eleFenceGroup)
          .bindPopup(desc);
      }
    })
  }

  // 人员列表勾选后地图显示位置信息回调
  public staffOfCheckedId(ids: number[]) {
    if (ids.length <= 0) {
      if (this.staffMarkers.length > 0) {
        this.staffMarkers.forEach(item => this.staffGroup.removeLayer(item.layerObj));
        this.staffMarkers.length = 0;
      }
      return;
    }
    // 根据id获取人的信息
    let selectStaffs: IStaff[] = [];
    ids.forEach(id => {
      const staff = this.CarVideoService.staffList.filter(item => item.id == id && item.isWorkCardActive === '在线');
      if (staff.length > 0) selectStaffs.push(staff[0]);
    });
    if (this.staffMarkers.length <= 0) {
      this.renderStaffLayer(selectStaffs);
    } else {
      let needRender: IStaff[] = differenceBy(selectStaffs, this.staffMarkers, 'id');
      console.log('needRender :>> ', needRender);
      let removeRender: IStaff[] = differenceBy(this.staffMarkers, selectStaffs, 'id');
      console.log('removeRender :>> ', removeRender);
      if (removeRender.length > 0) {
        this.staffGroup.removeLayer(removeRender[0].layerObj);
        const ids = this.staffMarkers.findIndex(item => item.id == removeRender[0].id);
        if (ids > -1) {
          this.staffMarkers.splice(ids, 1);
        }
      }
      this.renderStaffLayer(needRender);
    }
  }
  renderStaffLayer(selectStaffs) {
    const workCardList = this.workCardList;
    const getlocaltion = (id) => {
      return workCardList.filter(item => item.cardcode === id);
    };
    selectStaffs.forEach(item => {
      const card = getlocaltion(item.workCard);
      const lnglats = {
        coordinate: [
          Number(card[0].latitude),
          Number(card[0].longitude),
        ],
        timestamp: new Date().getTime()
      };
      let temp = {
        icon: "user-circle-o",
        customClasses: "icon_staff",
        iconShape: "marker",
        iconStyle: "color:#009cdc;padding: 2px;",
        borderColor: "009cdc",
        innerIconStyle: "margin-top:0px;margin-left:0px",
      };
      let str = `
        姓名：${item.name}<br>
        部门：${item.company}<br>
        电话：${item.phone ?? 123}<br>
        纬度： ${lnglats.coordinate[0]}<br>
        经度： ${lnglats.coordinate[1]}<br>
        时间： ${this.getLocalTime(lnglats.timestamp)}
      `;
      // @ts-ignore
      let mark = L.marker(lnglats.coordinate, {
        // @ts-ignore
        icon: L.BeautifyIcon.icon(temp),
      })
        .addTo(this.staffGroup)
        .bindPopup(str)
        .openPopup();
      mark.on('mouseover', () => {
        mark.openPopup();
      });
      const m = cloneDeep(item);
      m.layerObj = mark;
      this.staffMarkers.push(m);
      console.log('this.staffMarkers :>> ', this.staffMarkers);
      this.initStaffGlint();
    })
  }
  public onWorkCardUpdated(workCardList) {
    this.workCardList = workCardList;
    this.staffMarkers.forEach((item: IStaff) => {
      this.workCardList.forEach(card => {
        if (item.workCard === card.cardcode) {
          item.layerObj.setLatLng([card.latitude, card.longitude]);
        }
      })
    })
  }

  // 车辆列表勾选后地图显示位置信息回调
  public carOfCheckedId(ids: number[]) {
    if (ids.length <= 0) {
      if (this.carMarkers.length > 0) {
        this.carMarkers.forEach(item => this.carGroup.removeLayer(item.layerObj));
        this.carMarkers.length = 0;
      }
      return;
    }
    // 根据id获取车的信息
    let selectCars: any[] = [];
    ids.forEach(id => {
      const car = this.CarVideoService.carList.filter(item => item.id == id && item.orientator.active === '在线');
      if (car.length > 0) selectCars.push(car[0]);
    });
    if (this.carMarkers.length <= 0) {
      this.renderCarLayer(selectCars);
    } else {
      let needRender: any[] = differenceBy(selectCars, this.carMarkers, 'id');
      console.log('needRender :>> ', needRender);
      let removeRender: any[] = differenceBy(this.carMarkers, selectCars, 'id');
      console.log('removeRender :>> ', removeRender);
      if (removeRender.length > 0) {
        this.carGroup.removeLayer(removeRender[0].layerObj);
        const ids = this.carMarkers.findIndex(item => item.id == removeRender[0].id);
        if (ids > -1) {
          this.carMarkers.splice(ids, 1);
        }
      }
      this.renderCarLayer(needRender);
    }
  }
  renderCarLayer(selectCars) {
    selectCars.forEach(item => {
      const lnglats = {
        coordinate: [
          Number(item.orientator.latitude),
          Number(item.orientator.longitude),
        ],
        timestamp: new Date().getTime()
      };
      let temp = {
        icon: "bus",
        customClasses: "icon_car",
        iconShape: "marker",
        iconStyle: "color:#1eb300;padding: 2px;",
        borderColor: "#1eb300",
        innerIconStyle: "margin-top:0px;margin-left:0px",
      };
      let str = `
        车牌号：${item.name}<br>
        纬度： ${lnglats.coordinate[0]}<br>
        经度： ${lnglats.coordinate[1]}<br>
        时间： ${this.getLocalTime(lnglats.timestamp)}
      `;
      // @ts-ignore
      let mark = L.marker(lnglats.coordinate, {
        // @ts-ignore
        icon: L.BeautifyIcon.icon(temp),
      })
        .addTo(this.carGroup)
        .bindPopup(str)
        .openPopup();
      mark.on('mouseover', () => {
        mark.openPopup();
      });
      const m = cloneDeep(item);
      m.layerObj = mark;
      this.carMarkers.push(m);
      console.log('this.carfMarkers :>> ', this.carMarkers);
      this.initCarGlint();
    })
  }
  public onCarUpdated(carList) {
    this.carMarkers.forEach((item: any) => {
      carList.forEach(car => {
        if (item.id === car.id) {
          item.layerObj.setLatLng([car.orientator?.latitude, car.orientator?.longitude]);
        }
      })
    })
  }

  initStaffGlint() {
    $(`.icon_staff`).show();
    window.clearInterval(this.stafftimer);
    this.stafftimer = setInterval(() => {
      $(`.icon_staff`).toggle();
    }, 400);
  }
  initCarGlint() {
    $(".icon_car").show();
    window.clearInterval(this.cartimer);
    this.cartimer = setInterval(() => {
      $(".icon_car").toggle();
    }, 400);
  }
  getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
  }
}
