import { getCatesian3FromPX } from "../utils/index";
const Cesium = (window as any).Cesium;
export class DrawPolygon {
  id: string;
  viewer;
  entityColor: string;
  cb: any;
  handler;
  _polygon;
  _polyline;
  _positions;
  constructor(arg) {
    this.viewer = arg.viewer;
    this.id = arg.id;
    this.entityColor = arg.entityColor;
    this.cb = arg.cb;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this._polygon = null;
    this._polyline = null;
    this._positions = [];
  }

  get polygon() {
    return this._polygon;
  }
  get positions() {
    return this._positions;
  }
  startCreate() {
    this.handler.setInputAction((evt) => { //单机开始绘制
      var cartesian = getCatesian3FromPX(evt.position, this.viewer);
      if (this._positions.length == 0) {
        this._positions.push(cartesian.clone());
      }
      this._positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction((evt) => { //移动时绘制面
      if (this._positions.length < 1) return;
      var cartesian = getCatesian3FromPX(evt.endPosition, this.viewer);
      if (this._positions.length == 2) {
        if (!Cesium.defined(this._polyline)) {
          this._polyline = this.createPolyline();
        }
      }
      if (this._positions.length == 3) {
        if (this._polyline) {
          this.viewer.entities.remove(this._polyline);
          this._polyline = null;
        }
        if (!Cesium.defined(this._polygon)) {
          this._polygon = this.createPolygon();
        }
      }
      this._positions.pop();
      this._positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.setInputAction((evt) => {
      if (!this._polygon) return;
      var cartesian = getCatesian3FromPX(evt.position, this.viewer);
      this.handler.destroy();
      this._positions.pop();
      this._positions.push(cartesian);
      this.cb();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  createPolygon() {
    return this.viewer.entities.add({
      name: this.id,
      id: this.id,
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this._positions);
        }, false),
        material: Cesium.Color.fromCssColorString(this.entityColor),
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
      }
    });
  }
  createPolyline() {
    return this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function () {
          return this._positions
        }, false),
        clampToGround: true,
        material: Cesium.Color.YELLOW,
        width: 3
      }
    });
  }
  destroy() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
    if (this._polygon) {
      this.viewer.entities.remove(this._polygon);
      this._polygon = null;
    }
    if (this._polyline) {
      this.viewer.entities.remove(this._polyline);
      this._polyline = null;
    }
    this._positions = [];
  }
}