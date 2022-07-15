import { guid } from '@core/utils';
import { getCatesian3FromPX } from "./index";
import { cloneDeep } from "lodash";

const Cesium = (window as any).Cesium;
export class DrawPoint {
  id: string = guid();
  viewer;
  lineSetting;
  handler;
  labels: any = null;
  positions: Map<string, any> = new Map();
  num: number = 1;
  polyline: any = null;
  posCB: (posArr: Map<string, any>) => void;
  constructor(arg) {
    this.viewer = arg.viewer;
    this.lineSetting = arg.lineSetting;
    this.posCB = arg.posCB;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.labels = this.viewer.scene.primitives.add(new Cesium.LabelCollection());
  }

  startCreate() {
    this.handler.setInputAction((evt) => { //单击开始绘制
      const cartesian = getCatesian3FromPX(evt.position, this.viewer);
      if (!cartesian) return;
      const label = this.labels.add({
        id: 'label-' + guid(),
        position: cartesian,
        text: `点${this.num}`,
        font: '14px',
        fillColor: Cesium.Color.WHITE, // label文字颜色
        showBackground: true,
        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      });
      this.handler.destroy();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.setPosition(label);
      this.posCB(this.positions);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  destroyAll() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
    this.labels && this.labels.removeAll();
    this.positions.clear();
    this.num = 1;
    this.viewer.entities.remove(this.polyline);
    this.posCB(this.positions);
  }
  destroyOne(id, cb) {
    const b = this.labels._labels.filter(item => item.id === id)[0];
    if (b) {
      this.deletePosition(b);
      this.labels.remove(b);
      cb();
    }
  }
  handleModifyAlt(arg, cb) {
    const b = this.labels._labels.filter(item => item.id === arg.id)[0];
    if(b) {
      let cartographic = arg.ellipsoid.cartesianToCartographic(b.position);
      const lng = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      let newHeight = cartographic.height + Number(arg.alt);
      const newPosition = Cesium.Cartesian3.fromDegrees(lng, lat, newHeight);
      b.position = newPosition;
      cb();
    }
  }
  private setPosition(b) {
    this.positions.set(`点${this.num}`, b);
    this.num += 1;
  }
  private deletePosition(b) {
    this.positions.forEach((item, key, positions) => {
      if(item.id === b.id) {
        positions.delete(key);
      }
    });
    this.posCB(this.positions);
  }

  createLine(positions) {
    if (this.polyline) {
      this.viewer.entities.remove(this.polyline);
    };
    this.polyline = this.viewer.entities.add({
      id: 'polyline-' + guid(),
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          return positions;
        }, false),
        width: this.lineSetting.width ?? 2,
        material: Cesium.Color.fromCssColorString(this.lineSetting.material) ?? Cesium.Color.YELLOW,
        clampToGround: this.lineSetting.clampToGround,
      }
    });
  }
}