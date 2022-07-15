import L from 'leaflet';
import "leaflet-draw";
import "../../../../../../../../../assets/leaflet-plugin-trackplayback/src/control.trackplayback/index.js";
import "../../../../../../../../../assets/leaflet-plugin-trackplayback/src/leaflet.trackplayback/index.js";
/**
 * @description: leaflet-plugin-trackplayback在angular环境下很多坑，通过修改源码的方式才能运行：
 * 1、修改trackplayback.js和clock.js 的includes: L.Evented.prototype。see:
 * https://github.com/Leaflet/Leaflet/issues/5358
 * 2、修改control.playback.js 的_createButton方法的link.href = 'javascript:;'
 */
import { TrackType } from "../track/track.component";
function randomColor(Min,Max){
  const colorMap = new Map<number, string>(
    [
      [1, '#009cdc'],
      [2, '#fed800'],
      [3, '#800000'],
      [4, '#102a6a'],
      [5, '#ef5c9d'],
      [6, '#008f5a'],
      [7, '#fe6507'],
      [8, '#452870'],
    ]
  );
  const Range = Max - Min;
  const Rand = Math.random();
  const num = Min + Math.round(Rand * Range); //四舍五入
  return colorMap.get(num);
}
export function initTrackPlayback(type, map, track) {
  if (track.length == 0) {
    return;
  }
  let trackplayback = null;
  let trackplaybackControl = null;
  // const color = randomColor(1, 8);
  let c = type === TrackType.car ? '#009cdc' : '#fed800';
  console.log('c :>> ', c);
  const options = {
    clockOptions: {
      speed: 5,
      maxSpeed: 65,
    },
    trackPointOptions: {
      isDraw: true,
      useCanvas: true,
      stroke: false,
      color: c,
      fill: true,
      fillColor: c,
      opacity: 1,
      radius: 2,
    },
    trackLineOptions: {
      isDraw: true,
      stroke: true,
      color: c,
      weight: 4,
      fill: false,
      fillColor: c,
      opacity: 0.5,
    },
    targetOptions: {
      useImg: true,
      imgUrl: `assets/gridvo/car-video/${type === TrackType.car ? 'car_up' : 'man_icon'}.png`,
      width: 35,
      height: 35,
      color: "#f7db88",
      fillColor: "#f7db88",
    }
  };
  // @ts-ignore
  trackplayback = L.trackplayback(track, map, options);
  // @ts-ignore
  trackplaybackControl = L.trackplaybackcontrol(trackplayback);
  trackplaybackControl.addTo(map);
  trackplaybackControl._play();

}

export function handlePoints(params) {
  let shape = params.layerType;
  let coordinate = null;
  if (shape == "circle") {
    let temp = params.layer._latlng;
    coordinate = [
      [temp.lat, temp.lng],
      { radius: params.layer._mRadius }
    ];
    coordinate = JSON.stringify(coordinate);
  } else if (shape == "polygon" || shape == "rectangle") {
    coordinate = params.layer._latlngs[0].reduce((prev, cur) => {
      return prev.push([cur.lat, cur.lng]) && prev;
    }, []);
    coordinate.push(coordinate[0]);
    coordinate = JSON.stringify(coordinate);
  } else if (shape == "polyline") {
    coordinate = params.layer.getLatLngs().reduce((prev, cur) => {
      return prev.push([cur.lat, cur.lng]) && prev;
    }, []);
    coordinate = JSON.stringify(coordinate);
  }
  return { shape, coordinate };
}