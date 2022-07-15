/**
 * @description: 海康插件版视频监控的配置  复制于连江老项目
 * @param {*}
 * @return {*}
 */
const config = {
  im: {
    address: `http://${window.location.hostname}:8090`
  },
  hk: {
    download: `http://${window.location.hostname}:8888/download/VideoWebPlugin.exe`
  }
}

export default config