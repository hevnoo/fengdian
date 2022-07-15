import { Injectable } from '@angular/core';
import { Channels, INvrDeviceInfo, IPTZControl } from './hik-video.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import Cookies from 'js-cookie';
import { dateFormat } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class HikVideoService {
  nvrDeviceInfo: INvrDeviceInfo = {
    ip: '10.0.1.211',
    port: 80,
    username: 'admin',
    password: 'Gewu.2066'
  }
  iDevicePort: number;// 设备端口
  iRTSPPort: number;// RTSP端口
  selectedWnd: number = 0; // 选中的窗口
  szDeviceIdentify: string = null; // 登录的设备
  iStreamType: number = 1; // 码流类型
  spliceCount: number = 2;

  simulateChannels: Channels[] = []; //模拟通道
  digitalChannels: Channels[] = []; // 数字通道
  zeroChannels: Channels[] = []; // 零通道

  isPTZShow: boolean = false; // 控制台是否显示
  PTZControl: IPTZControl = {
    PTZAuto: false,
    direction: null,// 云台方向
    speed: 4, // 云台转向速度
    volume: 50, // 音量
    zoom: false// 电子放大
  }
  selectChannel: string;// 单窗口的时候选择通道

  /* 视频回放 */
  pbControl = { // 回放
    streamMode: "1", // 码流类型
    startTime: new Date(new Date().toLocaleDateString()).getTime(),
    endTime: new Date(new Date().toLocaleDateString()).getTime() + 1000 * 60 * 60 * 24 - 1
  };

  resizeClassName: string;

  constructor(private message: NzMessageService) { }

  fullScreen() {
    (window as any).WebVideoCtrl.I_FullScreen(true);
  }

  stopAllPlay() {
    // 4*4的窗口
    for (let i = 0; i < 16; i++) {
      let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(i),
        szInfo = "";

      if (oWndInfo != null) {
        (window as any).WebVideoCtrl.I_Stop({
          iWndIndex: i,
          success: () => {
            szInfo = "停止播放成功！";
            console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
          },
          error: () => {
            szInfo = "停止播放失败！可能导致部分窗口不可用，请刷新重试...";
            this.message.error(oWndInfo.szDeviceIdentify + " " + szInfo);
          }
        });
      }
    }
  }

  resizeWindow() {
    (window as any).WebVideoCtrl.I_Resize($(`#${this.resizeClassName}`).width(), $(`#${this.resizeClassName}`).height());
  }

  initPlugin(pluginContainer: string, iWndowType: number) {
    // 检查插件是否已经安装过
    var iRet = (window as any).WebVideoCtrl.I_CheckPluginInstall();
    if (-1 == iRet) {
      alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
      return;
    };

    // 初始化插件参数及插入插件
    (window as any).WebVideoCtrl.I_InitPlugin("100%", "100%", {
      bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
      iPackageType: 2, //无插件不支持
      //szColorProperty:"plugin-background:0000ff; sub-background:0000ff; sub-border:00ffff; sub-border-select:0000ff",   //2:PS 11:MP4
      iWndowType: iWndowType,
      bNoPlugin: true,
      cbSelWnd: (xmlDoc) => {
        this.selectedWnd = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
        console.log('当前选择的窗口编号>> ', this.selectedWnd);
      },
      cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
        var szInfo = "当前放大的窗口编号：" + iWndIndex;
        if (!bFullScreen) {
          szInfo = "当前还原的窗口编号：" + iWndIndex;
        }
        console.log(szInfo);
      },
      cbEvent: function (iEventType, iParam1, iParam2) {
        if (2 == iEventType) {// 回放正常结束
          console.log("窗口" + iParam1 + "回放结束！");
        } else if (-1 == iEventType) {
          console.log("设备" + iParam1 + "网络错误！");
        } else if (3001 == iEventType) {
          // clickStopRecord(g_szRecordType, iParam1); // 录像功能
          console.log("设备" + iParam1 + "录像");
        }
      },
      cbRemoteConfig: function () {
        console.log("关闭远程配置库！");
      },
      cbInitPluginComplete: () => {
        (window as any).WebVideoCtrl.I_InsertOBJECTPlugin(pluginContainer);

        // 插件bug 未能正确初始化窗口，只能调用这个方法强制初始化2*2窗口。
        this.changeWndNum(iWndowType);
        // 检查插件是否最新
        if (-1 == (window as any).WebVideoCtrl.I_CheckPluginVersion()) {
          alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
          return;
        }
      }
    });

    // window.document.addEventListener("resize", this.resizeWindow());
  }

  nvrLogout() {
    return new Promise((resolve, reject) => {
      if (!Cookies.get("webVideoCtrlProxy")) {
        resolve("none device")
        return;
      }
      let szDeviceIdentify = Cookies.get("webVideoCtrlProxy").split(":").join("_"),
        szInfo = "";
      console.log("logout_" + szDeviceIdentify);

      if (null == szDeviceIdentify) {
        resolve("device not found")
      }

      let iRet = (window as any).WebVideoCtrl.I_Logout(szDeviceIdentify);
      if (0 === iRet) {
        szInfo = "退出成功！";
        this.szDeviceIdentify = ""
        resolve("logout successed")
      } else {
        szInfo = "退出失败！";
        reject("logout failed")
      }
    })
  }

  nvrLogin(defaultChannels?) {
    return new Promise((resolve, reject) => {
      const szDeviceIdentify = `${this.nvrDeviceInfo.ip}_${this.nvrDeviceInfo.port}`;
      var iRet = (window as any).WebVideoCtrl.I_Login(
        this.nvrDeviceInfo.ip, 1, this.nvrDeviceInfo.port,
        this.nvrDeviceInfo.username, this.nvrDeviceInfo.password, {
        success: (xmlDoc) => {
          console.log(szDeviceIdentify + " 登录成功！");
          setTimeout(() => {
            this.szDeviceIdentify = szDeviceIdentify;
            this.getChannelInfo(resolve);
            console.log('数字通道列表 :>> ', this.digitalChannels);
            this.getDevicePort();

            const playFn = (defaultChannels?) => {
              if (this.digitalChannels.length >= 0) {
                this.digitalChannels.forEach((item, index) => {
                  this.defaultPlay(index, item.id, defaultChannels);
                })
              }
            }

            if (defaultChannels) {
              this.digitalChannels = this.digitalChannels.filter((channel) => {
                let c;
                defaultChannels.forEach(item => {
                  if (channel.name === item.deviceName) {
                    c = channel;
                  }
                })
                return typeof c !== 'undefined';
              })
              playFn(defaultChannels);
            } else {
              playFn();
            }
          }, 10);
        },
        error: function (status, xmlDoc) {
          console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
          reject(status);
        }
      });

      if (-1 == iRet) {
        console.log(szDeviceIdentify + " 已登录过！");
      }
    })
  }

  getChannelInfo(resolve) {
    if (null == this.szDeviceIdentify) return;

    // 模拟通道
    (window as any).WebVideoCtrl.I_GetAnalogChannelInfo(this.szDeviceIdentify, {
      async: false, // false表示同步
      success: (xmlDoc) => {
        var oChannels = $(xmlDoc).find("VideoInputChannel");

        $.each(oChannels, (i) => {
          var id = $(oChannels[i]).find("id").eq(0).text(),
            name = $(oChannels[i]).find("name").eq(0).text();
          if ("" == name) {
            name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
          }
          this.simulateChannels.push({ id, name })
        });
      },
      error: function (status, xmlDoc) {
        // showOPInfo(szDeviceIdentify + " 获取模拟通道失败！", status, xmlDoc);
      }
    });
    // 数字通道
    (window as any).WebVideoCtrl.I_GetDigitalChannelInfo(this.szDeviceIdentify, {
      async: false,
      success: (xmlDoc) => {
        let oChannels = $(xmlDoc).find("InputProxyChannelStatus");

        $.each(oChannels, (i) => {
          let id = $(oChannels[i]).find("id").eq(0).text(),
            name = $(oChannels[i]).find("name").eq(0).text(),
            online = $(oChannels[i]).find("online").eq(0).text(),
            ipAddress = $(oChannels[i]).find("ipAddress").eq(0).text();
          if ("false" == online) {// 过滤禁用的数字通道
            return true;
          }
          if ("" == name) {
            name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
          }
          this.digitalChannels.push({ id, name, ipAddress })
          resolve(this.digitalChannels);
        });
      },
      error: function (status, xmlDoc) {
        // showOPInfo(szDeviceIdentify + " 获取数字通道失败！", status, xmlDoc);
      }
    });
    // 零通道
    (window as any).WebVideoCtrl.I_GetZeroChannelInfo(this.szDeviceIdentify, {
      async: false,
      success: (xmlDoc) => {
        var oChannels = $(xmlDoc).find("ZeroVideoChannel");

        $.each(oChannels, (i) => {
          var id = $(oChannels[i]).find("id").eq(0).text(),
            name = $(oChannels[i]).find("name").eq(0).text();
          if ("" == name) {
            name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : (i + 1));
          }
          if ("true" == $(oChannels[i]).find("enabled").eq(0).text()) {// 过滤禁用的零通道
            this.zeroChannels.push({ id, name })
          }
        });
      },
      error: function (status, xmlDoc) {
        // showOPInfo(szDeviceIdentify + " 获取零通道失败！", status, xmlDoc);
      }
    });
  }

  getDevicePort() {
    if (null == this.szDeviceIdentify) return;

    var oPort = (window as any).WebVideoCtrl.I_GetDevicePort(this.szDeviceIdentify);
    if (oPort !== null) {
      this.iDevicePort = oPort.iDevicePort
      this.iRTSPPort = oPort.iRtspPort
    }
  }

  defaultPlay(iWndIndex, iChannelID, cameraPreset?) {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(iWndIndex);
    let szInfo;
    if (!this.szDeviceIdentify) return;
    const startRealPlay = () => {
      (window as any).WebVideoCtrl.I_StartRealPlay(this.szDeviceIdentify, {
        iWndIndex,
        iChannelID,
        iStreamType: 2, //码流
        success: () => {
          szInfo = "开始预览成功！";
          if (cameraPreset) {
            const channel = this.digitalChannels.filter((item) => item.id === iChannelID)[0];
            const target = cameraPreset.map(item => {
              let ta = {
                channel: '',
                position: ''
              }
              if(item.deviceName === channel.name) {
                ta.channel = channel.id;
                ta.position = item.position;
              }
              return ta.channel !== '' ? ta : undefined;
            })

            console.log('通道对应预置点 :>> ', target.filter(Boolean)[0]);
            // 去预置点
            this.clickGoPreset(target.filter(Boolean)[0]);
          }
          console.log(`${this.szDeviceIdentify} ${szInfo} 窗口->${iWndIndex}`);
        },
        error: (status, xmlDoc) => {
          if (403 === status) {
            szInfo = "设备不支持Websocket取流！";
          } else {
            szInfo = "开始预览失败！";
          }
          console.log(this.szDeviceIdentify + " " + szInfo);
        }
      });
    };

    if (oWndInfo != null) {// 已经在播放了，先停止
      (window as any).WebVideoCtrl.I_Stop({
        success: () => {
          startRealPlay();
        },
        error: () => {
          console.error("停止播放失败！请尝试使用其它窗口播放或刷新页面重试...")
        }
      });
    } else {
      startRealPlay();
    }
  }

  // 调用预置点
  clickGoPreset(p) {
    if (typeof p === 'undefined') return;
    if (typeof p?.position === 'undefined') return;
    const szUrl = `ISAPI/PTZCtrl/channels/${p.channel}/presets/${p.position}/goto`;
    const options = {
      async: false,
      type: "PUT",
      success: () => {
        console.log('调用预置点成功！');
      },
      error: function (error) {
        console.log('error :>> ', error);
      }
    };

    (window as any).WebVideoCtrl.I_SendHTTPRequest(this.szDeviceIdentify, szUrl, options);
  }

  // 窗口分割数
  changeWndNum(iType) {
    iType = parseInt(iType, 10);
    (window as any).WebVideoCtrl.I_ChangeWndNum(iType);
    this.spliceCount = iType;
    if (this.spliceCount === 2 || this.spliceCount === 4) {
      this.isPTZShow = false;
      setTimeout(() => {
        this.resizeWindow();
      }, 16);
    } else {
      this.isPTZShow = true;
      setTimeout(() => {
        this.resizeWindow();
      }, 16);
    }
  }

  // PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
  mouseDownPTZControl(direction) {
    this.PTZControl.direction = direction;
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      iPTZSpeed = this.PTZControl.speed;

    if (oWndInfo != null) {
      if (9 === direction && this.PTZControl.PTZAuto) {
        iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
      } else {
        this.PTZControl.PTZAuto = false;// 点击其他方向，自动肯定会被关闭
      }
      (window as any).WebVideoCtrl.I_PTZControl(direction, false, {
        iPTZSpeed: iPTZSpeed,
        success: () => {
          if (9 === direction && this.PTZControl.PTZAuto) {
            console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！");
          } else {
            console.log(oWndInfo.szDeviceIdentify + " 开启云台成功！");
          }
          if (9 === direction) {
            this.PTZControl.PTZAuto = !this.PTZControl.PTZAuto;
          }
        },
        error: (status, xmlDoc) => {
          console.log(oWndInfo.szDeviceIdentify + " 开启云台失败！" + status);
        }
      });
    }
  }

  // 方向PTZ停止
  mouseUpPTZControl() {
    this.PTZControl.direction = null;
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd);

    if (oWndInfo != null) {
      (window as any).WebVideoCtrl.I_PTZControl(1, true, {
        success: () => {
          console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！");
        },
        error: (status, xmlDoc) => {
          console.log(oWndInfo.szDeviceIdentify + " 停止云台失败！" + status);
        }
      });
    }
  }

  selectChannelChange(selectChannel) {
    this.selectChannel = selectChannel;
    console.log('视频回放选择的通道 :>> ', this.selectChannel);
    console.log('this.selectedWnd :>> ', this.selectedWnd);
    this.defaultPlay(this.selectedWnd, this.selectChannel);
  }

  // 电子放大
  handleZoomChange(zoom: boolean) {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szInfo = "";

    if (oWndInfo != null) {
      if (this.PTZControl.zoom) {
        let iRet = (window as any).WebVideoCtrl.I_EnableEZoom();
        if (0 === iRet) {
          szInfo = "启用电子放大成功！";
          this.PTZControl.zoom = zoom;
        } else {
          szInfo = "启用电子放大失败！";
        }
      } else {
        let iRet = (window as any).WebVideoCtrl.I_DisableEZoom();
        if (0 === iRet) {
          szInfo = "禁用电子放大成功！";
          this.PTZControl.zoom = zoom;
        } else {
          szInfo = "禁用电子放大失败！";
        }
      }
      console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
  }

  // 变倍
  PTZZoom(zoom: string) {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd);

    if (oWndInfo != null) {
      if (zoom === 'ZOOM_IN') {
        (window as any).WebVideoCtrl.I_PTZControl(10, false, {
          iWndIndex: this.selectedWnd,
          success: () => {
            console.log(oWndInfo.szDeviceIdentify + " 调焦+ 成功！");
          },
          error: (status, xmlDoc) => {
            console.log(oWndInfo.szDeviceIdentify + "  调焦+ 失败！" + status + "该设备暂不支持此功能");
          }
        });
      } else if (zoom === 'ZOOM_OUT') {
        (window as any).WebVideoCtrl.I_PTZControl(11, false, {
          iWndIndex: this.selectedWnd,
          success: () => {
            console.log(oWndInfo.szDeviceIdentify + " 调焦- 成功！");
          },
          error: (status, xmlDoc) => {
            console.log(oWndInfo.szDeviceIdentify + "  调焦- 失败！" + status + "该设备暂不支持此功能");
          }
        });
      }
    }
  }
  PTZZoomStop(inOut: number) {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd);

    if (oWndInfo != null) {
      if (inOut === 10) {
        (window as any).WebVideoCtrl.I_PTZControl(10, true, {
          iWndIndex: this.selectedWnd,
          success: () => {
            console.log(oWndInfo.szDeviceIdentify + " 停止调焦+成功！");
          },
          error: (status, xmlDoc) => {
            console.log(oWndInfo.szDeviceIdentify + "  停止调焦+失败！" + status + "该设备暂不支持此功能");
          }
        });
      } else if (inOut === 11) {
        (window as any).WebVideoCtrl.I_PTZControl(11, true, {
          iWndIndex: this.selectedWnd,
          success: () => {
            console.log(oWndInfo.szDeviceIdentify + " 停止调焦-成功！");
          },
          error: (status, xmlDoc) => {
            console.log(oWndInfo.szDeviceIdentify + "  停止调焦-失败！" + status + "该设备暂不支持此功能");
          }
        });
      }
    }
  }

  // 速度改变
  speedChange(speed) {
    this.PTZControl.speed = speed;
  }

  // 抓图
  clickCapturePic() {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szInfo = "";

    if (oWndInfo != null) {
      var xmlDoc = (window as any).WebVideoCtrl.I_GetLocalCfg();
      var szCaptureFileFormat = "0";
      if (xmlDoc != null) {
        szCaptureFileFormat = $(xmlDoc).find("CaptureFileFormat").eq(0).text();
      }

      var szPicName = oWndInfo.szDeviceIdentify + "_" + "_" + new Date().getTime();

      szPicName += ("0" === szCaptureFileFormat) ? ".jpg" : ".bmp";

      (window as any).WebVideoCtrl.I2_CapturePic(szPicName, {
        bDateDir: true  //是否生成日期文件
      }).then(() => {
        szInfo = "抓图成功！";
        this.message.success(oWndInfo.szDeviceIdentify + " " + szInfo);
      }, function () {
        szInfo = "抓图失败！";
        this.message.success(oWndInfo.szDeviceIdentify + " " + szInfo);
      });
    }
  }

  // 开始回放
  clickStartPlayback() {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szDeviceIdentify = this.szDeviceIdentify,
      iRtspPort = this.iRTSPPort,
      iStreamType = parseInt(this.pbControl.streamMode, 10),
      bZeroChannel = false,
      iChannelID = parseInt(this.selectChannel, 10),
      szStartTime = dateFormat(new Date(this.pbControl.startTime), 'yyyy-MM-dd hh:mm:ss'),
      szEndTime = dateFormat(new Date(this.pbControl.endTime), 'yyyy-MM-dd hh:mm:ss'),
      szInfo = "",
      bChecked = false,
      iRet = -1;
    console.log(oWndInfo, szDeviceIdentify, iStreamType, iChannelID, iChannelID, szStartTime, szEndTime);

    if (null == szDeviceIdentify) {
      return;
    }

    if (bZeroChannel) {// 零通道不支持回放
      return;
    }

    let startPlayback = function () {
      if (bChecked) {// 启用转码回放
        var oTransCodeParam = {
          TransFrameRate: "14",// 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
          TransResolution: "1",// 255：Auto，3：4CIF，2：QCIF，1：CIF
          TransBitrate: "19"// 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
        };
        (window as any).WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
          iRtspPort: iRtspPort,
          iStreamType: iStreamType,
          iChannelID: iChannelID,
          szStartTime: szStartTime,
          szEndTime: szEndTime,
          oTransCodeParam: oTransCodeParam,
          success: function () {
            szInfo = "开始回放成功！";
            console.log(szDeviceIdentify + " " + szInfo);
          },
          error: function (status, xmlDoc) {
            if (403 === status) {
              szInfo = "设备不支持Websocket取流！";
            } else {
              szInfo = "开始回放失败！";
            }
            console.log(szDeviceIdentify + " " + szInfo);
          }
        });
      } else {
        (window as any).WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
          iRtspPort: iRtspPort,
          iStreamType: iStreamType,
          iChannelID: iChannelID,
          szStartTime: szStartTime,
          szEndTime: szEndTime,
          success: function () {
            szInfo = "开始回放成功！";
            console.log(szDeviceIdentify + " " + szInfo);
          },
          error: function (status, xmlDoc) {
            if (403 === status) {
              szInfo = "设备不支持Websocket取流！";
            } else {
              szInfo = "开始回放失败！";
            }
            console.log(szDeviceIdentify + " " + szInfo);
          }
        });
      }
    };

    if (oWndInfo != null) {// 已经在播放了，先停止
      (window as any).WebVideoCtrl.I_Stop({
        success: function () {
          startPlayback();
        }
      });
    } else {
      startPlayback();
    }
  }
  // 停止回放
  clickStopPlayback() {
    var oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szInfo = "";

    if (oWndInfo != null) {
      (window as any).WebVideoCtrl.I_Stop({
        success: function () {
          szInfo = "停止回放成功！";
          console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
        },
        error: function () {
          szInfo = "停止回放失败！";
          console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
        }
      });
    }
  }
}
