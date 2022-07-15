const Cesium = (window as any).Cesium;
import { guid } from '@core/utils';
interface IMatrix {
  lng: number;
  lat: number;
  alt: number;
  id?: string;
}
export const createPanelMatrix = (firstPanel, spacing, incline, slope, pcs) => {
  let matrix: IMatrix[] = [];
  let spa = 0;
  let inc = 0;
  let slo = 0;
  for (let i = 0; i <= pcs - 1; i++) {
    const lng = firstPanel.lng + spa;
    const lat = firstPanel.lat + inc;
    const alt = firstPanel.alt + slo;
    const id = guid();
    matrix.push({ lng, lat, alt, id });
    spa += spacing;
    inc += incline;
    slo += slope;
  }
  return matrix;
}

export const createPanelMatrix2 = (firstPanel, spacing, incline, slope, pcs) => {
  let matrix: IMatrix[] = [
    {
      lng: firstPanel.lng,
      lat: firstPanel.lat,
      alt: firstPanel.alt
    }
  ];
  let spa = spacing;
  let inc = incline;
  let slo = slope;
  for (let i = 0; i <= pcs; i++) {
    const lng = firstPanel.lng + spa;
    const lat = firstPanel.lat + inc;
    const alt = firstPanel.alt + slo;
    matrix.push({ lng, lat, alt });
    spa += spacing;
    inc += incline;
    slo += slope;
  }
  return matrix;
}

export function adjustPosition(models, Cesium) {
  document.onkeydown = function (event) {
    let e = event || window.event || arguments.callee.caller.arguments[0];
    //位置
    if (e.key == 'ArrowUp') {
      models.modelMatrix[12] = models.modelMatrix[12] + 1
    } else if (e.key == 'ArrowDown') {
      models.modelMatrix[12] = models.modelMatrix[12] - 1
    } else if (e.key == 'ArrowLeft') {
      models.modelMatrix[14] = models.modelMatrix[14] + 1
    } else if (e.key == 'ArrowRight') {
      models.modelMatrix[14] = models.modelMatrix[14] - 1
    }
    //角度
    else if (e.key == '8') {
      let m1 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(1))
      Cesium.Matrix4.multiplyByMatrix3(models.modelMatrix, m1, models.modelMatrix);
    } else if (e.key == '2') {
      let m1 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-1))
      Cesium.Matrix4.multiplyByMatrix3(models.modelMatrix, m1, models.modelMatrix);
    } else if (e.key == '4') {
      let m1 = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(1));
      Cesium.Matrix4.multiplyByMatrix3(models.modelMatrix, m1, models.modelMatrix);
    } else if (e.key == '6') {
      let m1 = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-1));
      Cesium.Matrix4.multiplyByMatrix3(models.modelMatrix, m1, models.modelMatrix);
    } else if (e.key === '1') {
      let m1 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(1));
      Cesium.Matrix4.multiplyByMatrix3(models.modelMatrix, m1, models.modelMatrix);
    } else if (e.key == '3') {
      let m1 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(-1));
      Cesium.Matrix4.multiplyByMatrix3(models.modelMatrix, m1, models.modelMatrix);
    }
    //高度
    else if (e.key == '7') {
      models.modelMatrix[13] = models.modelMatrix[13] + 1
    }
    else if (e.key == '9') {
      models.modelMatrix[13] = models.modelMatrix[13] - 1
    }
    console.log(models.modelMatrix)
  }
}

export function getCatesian3FromPX(px, viewer) {
  if (viewer && px) {
    var picks = viewer.scene.drillPick(px);
    var cartesian = null;
    var isOn3dtiles = false,
      isOnTerrain = false;
    // drillPick
    for (let i in picks) {
      let pick = picks[i];

      if (
        (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
        (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
        (pick && pick.primitive instanceof Cesium.Model)
      ) {
        //模型上拾取
        isOn3dtiles = true;
      }
      // 3dtilset
      if (isOn3dtiles) {
        viewer.scene.pick(px); // pick
        cartesian = viewer.scene.pickPosition(px);
        if (cartesian) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          if (cartographic.height < 0) cartographic.height = 0;
          let lon = Cesium.Math.toDegrees(cartographic.longitude),
            lat = Cesium.Math.toDegrees(cartographic.latitude),
            height = cartographic.height;
          cartesian = transformWGS84ToCartesian({
            lng: lon,
            lat: lat,
            alt: height,
          });
        }
      }
    }
    // 地形
    let boolTerrain =
      viewer.terrainProvider instanceof
      Cesium.EllipsoidTerrainProvider;
    // Terrain
    if (!isOn3dtiles && !boolTerrain) {
      var ray = viewer.scene.camera.getPickRay(px);
      if (!ray) return null;
      cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      isOnTerrain = true;
    }
    // 地球
    if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
      cartesian = viewer.scene.camera.pickEllipsoid(
        px,
        viewer.scene.globe.ellipsoid
      );
    }
    if (cartesian) {
      let position = transformCartesianToWGS84(cartesian, viewer);
      if (position.alt < 0) {
        cartesian = transformWGS84ToCartesian(position, 0.1);
      }
      return cartesian;
    }
    return false;
  }
}
function transformCartesianToWGS84(cartesian, viewer) {
  if (viewer && cartesian) {
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    return {
      lng: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
      alt: cartographic.height,
    };
  }
}

function transformWGS84ToCartesian(position, alt ?) {
    return position ?
      Cesium.Cartesian3.fromDegrees(
        position.lng || position.lon,
        position.lat,
        position.alt = alt || position.alt,
        Cesium.Ellipsoid.WGS84
      ) :
      Cesium.Cartesian3.ZERO
}