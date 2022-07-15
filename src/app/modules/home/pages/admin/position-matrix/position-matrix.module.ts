export interface ILnglat {
  lng: number;
  lat: number;
  alt: number;
}
export interface ISettingsObj {
  tilesUrl: string, // 瓦片地址
  modelUrl: string, // 模型地址
}
const Cesium = (window as any).Cesium;
export class PositionMatrix {
  viewer;
  handler;
  container: JQuery<HTMLElement>;
  originLnglat: ILnglat;
  tilesUrl: string;
  settingsObj: ISettingsObj;

  constructor(container: JQuery<HTMLElement>, opt: ISettingsObj) {
    this.container = container;
    this.settingsObj = opt;
  }

  readyPromise() {
    return new Promise((resolve) => {
      this.init(resolve);
    })
  }

  init(resolve) {
    this.viewer = new Cesium.Viewer(this.container[0], {
      animation: false,       //是否显示动画控件
      homeButton: false,       //是否显示home键
      geocoder: false,         //是否显示地名查找控件        如果设置为true，则无法查询
      baseLayerPicker: false, //是否显示图层选择控件
      timeline: false,        //是否显示时间线控件
      fullscreenButton: false, //是否全屏显示
      scene3DOnly: true,     //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      infoBox: false,         //是否显示点击要素之后显示的信息
      sceneModePicker: false,  //是否显示投影方式控件  三维/二维
      navigationInstructionsInitiallyVisible: false,
      navigationHelpButton: false,     //是否显示帮助信息控件
      selectionIndicator: false,
    });

    resolve(this.viewer);

    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.scene.sun.show = false; //在Cesium1.6(不确定)之后的版本会显示太阳和月亮，不关闭会影响展示
    this.viewer.scene.moon.show = false;
    this.viewer.scene.skyBox.show = false;//关闭天空盒，否则会显示天空颜色
    this.viewer.scene.skyAtmosphere.show = false; //隐藏大气圈
    // viewer.scene.undergroundMode = true; //重要，开启地下模式，设置基色透明，这样就看不见黑色地球了
    this.viewer.scene.globe.show = false; //不显示地球，这条和地球透明度选一个就可以
    // viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);
    // viewer.scene.backgroundColor = new Cesium.Color(255, 255, 255, 0);
    this.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
    this.viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;

    // 加载3dtiles
    const tileset = new Cesium.Cesium3DTileset({
      url: this.settingsObj.tilesUrl,
    });
    const height = 0;//根据地形设置调整高度
    tileset.readyPromise.then(function (argument) {
      //贴地显示
      var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
      var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
      var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + height);
      var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    })
    this.viewer.scene.primitives.add(tileset);

    // 初始位置
    this.viewer.zoomTo(tileset);

    // 处理器
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  }
}
