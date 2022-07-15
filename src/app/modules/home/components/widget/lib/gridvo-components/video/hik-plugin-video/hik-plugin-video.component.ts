import { Component, OnInit, OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { WidgetConfig } from '@shared/models/widget.models';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import Cookies from 'js-cookie';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import config from "../../../../../../../../../assets/hik/config.js";
interface ISelectedNode {
  name: string;
  channelNo: string;
}

enum ITabsLabel {
  live,
  playBack,
}

/**
 * @description: 插件版本视频监控
 * @param {*}
 * @return {*}
 */
// oWebControl 回放实例 liveWebControl 监控实例
let oWebControl, liveWebControl;
@Component({
  selector: 'tb-hik-plugin-video',
  templateUrl: './hik-plugin-video.component.html',
  styleUrls: ['./hik-plugin-video.component.scss']
})
export class HikPluginVideoComponent implements OnInit, OnDestroy {
  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;

  nvrDeviceInfo = {
    ip: undefined,
    port: undefined,
    username: undefined,
    password: undefined
  }

  routerLister$: Subscription = null;
  selectedNode: ISelectedNode = { // 点击左侧树 选择的设备
    name: undefined,
    channelNo: undefined,
  };

  config = config;
  activeName = ITabsLabel.live;
  formData = {
    cameraIndexCode: '2a7db7b99f264bd6b55002827214889c',
    streamMode: 0,
    startTime: '',
    endTime: ''
  };
  initCount = 0; // 回放启动插件失败重连次数
  pubKey = '';
  creatPlayBack = 0; //记录进入回放tab次数，只在第一次进入初始化视频回放实例
  liveLayout = '1+9';
  liveInitCount = 0;// 回放启动插件失败重连次数
  liveCameraIndexCode = '2a7db7b99f264bd6b55002827214889c';
  cameraIndexCode = '2a7db7b99f264bd6b55002827214889c';
  liveStreamMode = 0;
  playedCameraCode = []; // 存放已在播放的预览摄像头code
  playbackCameraCode = []; //存放已在播放的回放摄像头code
  pbRecordLocation = '1';
  top = 0;
  left = 0;
  ip = /10\.35\.103\.*/.test(window.location.hostname) ? "10.35.103.8" : "10.104.182.34";

  constructor(private router: Router,
    private modal: NzModalService,
    private message: NzMessageService) { }

  ngOnDestroy(): void {
    oWebControl && oWebControl.JS_DestroyWnd()
    liveWebControl && liveWebControl.JS_DestroyWnd()

    oWebControl && oWebControl.JS_Disconnect().then(function () { // oWebControl 为 WebControl 的对象
      // 断开与插件服务的连接 成功
    }, function () {
      // 断开与插件服务的连接 失败
    });
    liveWebControl && liveWebControl.JS_Disconnect().then(function () { // oWebControl 为 WebControl 的对象
      // 断开与插件服务的连接 成功
    }, function () {
      // 断开与插件服务的连接 失败
    });
  }
  ngOnInit(): void {
    this.ctx.$scope.hkVideoWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
    this.listenRouterChange();

    if ((window as any).WebControl) {
      // this.initPreview()
    } else {
      this.message.create('warning', '未检测到webControl插件,请先安装该windows插件！')
    }

    $(window).resize(() => {
      if (oWebControl != null) {
        oWebControl.JS_Resize(900, 600);
        this.setWndCover();
      }
    });

    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    $(window).scroll(() => {
      if (liveWebControl != null) {
        liveWebControl.JS_Resize(900, 600);
        this.setLiveWndCover();
      }
    });
  }

  private initWidgetConfig() {
    // if (typeof (this.widgetConfig.settings.szIP) === 'undefined') {
    //   this.modal.error({
    //     nzTitle: '设备未接入',
    //     nzContent: '暂无监控信息'
    //   });
    // }
    this.nvrDeviceInfo.ip = this.widgetConfig.settings.szIP;
    this.nvrDeviceInfo.port = this.widgetConfig.settings.szPort;
    this.nvrDeviceInfo.username = this.widgetConfig.settings.szUsername;
    this.nvrDeviceInfo.password = this.widgetConfig.settings.szPassword;
  }

  handleTabClick($event) {
    // console.log(this.activeName, $event);

    if (this.activeName === ITabsLabel.playBack) {
      this.creatPlayBack = this.creatPlayBack + 1
      if (this.creatPlayBack === 1) {
        this.initplayBack()
        // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
        $(window).resize(() => {
          if (oWebControl != null) {
            oWebControl.JS_Resize(900, 600);
            this.setWndCover();
          }
        });

        // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
        $(window).scroll(() => {
          if (oWebControl != null) {
            oWebControl.JS_Resize(900, 600);
            this.setWndCover();
          }
        });
      }
      if (this.creatPlayBack !== 1) {
        oWebControl && oWebControl.JS_ShowWnd();
      }
      liveWebControl && liveWebControl.JS_HideWnd();
    } else if (this.activeName === ITabsLabel.live) {
      oWebControl && oWebControl.JS_HideWnd()
      liveWebControl && liveWebControl.JS_ShowWnd();
    }
  }
  
  // 点击左侧树预览
  startPreviewByTreeClick(wndId = 0) {
    var cameraIndexCode = this.selectedNode.channelNo;     //获取输入的监控点编号值，必填
    var streamMode = this.liveStreamMode;                                     //主子码流标识：0-主码流，1-子码流
    var transMode = 1;                                      //传输协议：0-UDP，1-TCP
    var gpuMode = 0;                                        //是否启用GPU硬解，0-不启用，1-启用

    cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
    cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");

    liveWebControl.JS_RequestInterface({
      funcName: "startPreviewByTreeClick",
      argument: JSON.stringify({
        cameraIndexCode: cameraIndexCode,               //监控点编号
        streamMode: streamMode,                         //主子码流标识
        transMode: transMode,                           //传输协议
        gpuMode: gpuMode,                               //是否开启GPU硬解
        // wndId:wndId                                  //播放窗口序号（在2x2以上布局下可指定播放窗口）
      })
    })
    this.playedCameraCode.push(this.liveCameraIndexCode)
  }
  // 点击左侧树回放
  startPlayBackByTreeClick() {
    var cameraIndexCode = this.selectedNode.channelNo        //获取输入的监控点编号值，必填
    // var startTimeStamp = this.formData.startTime
    var startTimeStamp = new Date(new Date().toDateString()).getTime() - 60 * 60 * 24 * 1000 * 20 + 1;
    // var endTimeStamp = this.formData.startTime;        //回放结束时间戳，必填
    var endTimeStamp = new Date().getTime();        //回放结束时间戳，必填
    var playTimeStamp = new Date(new Date().toDateString()).getTime() - 1;        //回放开始时间
    // var recordLocation = parseInt(this.pbRecordLocation);                                     //录像存储位置：0-中心存储，1-设备存储
    var recordLocation = 1;                                     //录像存储位置：0-中心存储，1-设备存储
    var transMode = 1;                                          //传输协议：0-UDP，1-TCP
    var gpuMode = 0;                                            //是否启用GPU硬解，0-不启用，1-启用
    var wndId = -1;                                             //播放窗口序号（在2x2以上布局下可指定播放窗口）

    console.log(cameraIndexCode, startTimeStamp, endTimeStamp);
    oWebControl.JS_RequestInterface({
      funcName: "startPlayback",
      argument: JSON.stringify({
        cameraIndexCode,                   //监控点编号
        startTimeStamp: Math.floor(startTimeStamp / 1000).toString(),  //录像查询开始时间戳，单位：秒
        endTimeStamp: Math.floor(endTimeStamp / 1000).toString(),      //录像结束开始时间戳，单位：秒
        playTimeStamp: Math.floor(playTimeStamp / 1000).toString(),
        recordLocation,                     //录像存储类型：0-中心存储，1-设备存储
        transMode,                               //传输协议：0-UDP，1-TCP
        gpuMode,                                   //是否启用GPU硬解，0-不启用，1-启用
        wndId                                         //可指定播放窗口
      })
    })
    this.playbackCameraCode.push(cameraIndexCode)
  }

  // 初始化预览
  initPreview() {
    liveWebControl = new (window as any).WebControl({
      szPluginContainer: "liveVideo",                       //指定容器id
      iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
      iServicePortEnd: 15909,
      cbConnectSuccess: () => {
        //实例创建成功后需要启动服务
        liveWebControl.JS_StartService("window", {
          dllPath: "./VideoPluginConnect.dll"
        }).then(() => {
          liveWebControl.JS_CreateWnd("liveVideo", $('#liveVideo').width() - 1, $('#liveVideo').height() - 1).then(() => {         //JS_CreateWnd创建视频播放窗口，宽高可设定
            console.log("live JS_CreateWnd success");
            this.liveInit();                                 //创建播放实例成功后初始化
          });
        }, function () {

        });
      },
      cbConnectError: () => {
        oWebControl = null;
        $("#liveVideo").html("<p style='color: #efefef'>插件未启动，正在尝试启动，请稍候...</p>");
        (window as any).WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
        this.liveInitCount += 1;
        console.log(this.liveInitCount);
        if (this.liveInitCount < 3) {
          setTimeout(() => {
            this.initPreview();
          }, 2000)
        } else {
          $("#liveVideo").html("<p style='color: #efefef'>插件启动失败，请检查插件是否安装！</p>");
          this.modal.confirm({
            nzTitle: '<i>插件启动失败，请检查插件是否安装?</i>',
            nzContent: '<b>如未安装请点击去下载按钮安装插件后重新打开浏览器</b>',
            nzOkText: '去下载',
            nzOkType: 'primary',
            nzOnOk: () => window.open(this.config.hk.download),
            nzCancelText: '知道了',
            nzOnCancel: () => console.log('取消去下载')
          });
        }
      },
      cbConnectClose: () => {
        console.log("cbConnectClose");
        oWebControl = null;
      }
    });
  }
  liveInit() {
    this.liveGetPubKey(() => {

      ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
      var appkey = "24468994";                           //综合安防管理平台提供的appkey，必填
      var secret = this.setEncrypt("HNs01WKABHXeREDDZTjd");   //综合安防管理平台提供的secret，必填
      var ip = this.ip;                           //综合安防管理平台IP地址，必填
      var playMode = 0;                                  //初始播放模式：0-预览，1-回放
      var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
      var snapDir = "D:\\SnapDir";                       //抓图存储路径
      var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
      var layout = this.liveLayout;                                //playMode指定模式的布局
      var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
      var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
      var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
      var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
      var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
      var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
      var reconnectDuration = 4;                             // 每次重连的重连间隔 >= reconnectTime
      ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

      liveWebControl.JS_RequestInterface({
        funcName: "init",
        argument: JSON.stringify({
          appkey,                            //API网关提供的appkey
          secret,                            //API网关提供的secret
          ip,                                    //API网关IP地址
          playMode,                        //播放模式（决定显示预览还是回放界面）
          port,                                //端口
          snapDir,                          //抓图存储路径
          videoDir,                        //紧急录像或录像剪辑存储路径
          layout,                            //布局
          enableHTTPS,                  //是否启用HTTPS协议
          encryptedFields,          //加密字段
          showToolbar,                  //是否显示工具栏
          showSmart,                      //是否显示智能信息
          buttonIDs,             //自定义工具条按钮
          reconnectTimes,            //重连次数
          reconnectDuration         //重连间隔
        })
      }).then(function (oData) {
        console.log('视频监控实例初始成功 :>> ');
        liveWebControl.JS_Resize($('#liveVideo').width(), $('#liveVideo').height());  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
      });
    });
  }
  liveGetPubKey(callback) {
    liveWebControl.JS_RequestInterface({
      funcName: "getRSAPubKey",
      argument: JSON.stringify({
        keyLength: 1024
      })
    }).then((oData) => {
      if (oData.responseMsg.data) {
        this.pubKey = oData.responseMsg.data;
        callback()
      }
    })
  }

  // 初始化回放
  initplayBack() {
    oWebControl = new (window as any).WebControl({
      szPluginContainer: "playWnd",                       //指定容器id
      iServicePortStart: 15900,                           //指定起止端口号，建议使用该值
      iServicePortEnd: 15909,
      cbConnectSuccess: () => {
        oWebControl && oWebControl.JS_ShowWnd();
        //实例创建成功后需要启动服务
        oWebControl.JS_StartService("window", {
          dllPath: "./VideoPluginConnect.dll"
        }).then(() => {
          oWebControl.JS_CreateWnd("playWnd", $('#playWnd').width() - 1, $('#playWnd').height() - 1).then(() => {         //JS_CreateWnd创建视频播放窗口，宽高可设定
            console.log("JS_CreateWnd success");
            this.init();                                 //创建播放实例成功后初始化
          });
        }, function () {

        });
      },
      cbConnectError: () => {
        console.log("cbConnectError");
        oWebControl = null;
        $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
        (window as any).WebControl.JS_WakeUp("VideoWebPlugin://");        //程序未启动时执行error函数，采用wakeup来启动程序
        this.initCount = this.initCount++;
        if (this.initCount < 3) {
          setTimeout(function () {
            this.initplayBack();
          }, 3000)
        } else {
          $("#playWnd").html("插件启动失败，请检查插件是否安装！");
        }
      },
      cbConnectClose: () => {
        console.log("cbConnectClose");
        oWebControl = null;
      }
    });
  }
  //初始化
  init() {
    this.getPubKey(() => {

      ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
      var appkey = "24468994";                           //综合安防管理平台提供的appkey，必填
      var secret = this.setEncrypt("HNs01WKABHXeREDDZTjd");   //综合安防管理平台提供的secret，必填
      var ip = this.ip;                           //综合安防管理平台IP地址，必填
      var playMode = 1;                                  //初始播放模式：0-预览，1-回放
      var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
      var snapDir = "D:\\SnapDir";                       //抓图存储路径
      var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
      var layout = "1x1";                                //playMode指定模式的布局
      var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
      var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
      var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
      var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
      var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
      //var reconnectTimes = 2;                            // 重连次数，回放异常情况下有效
      //var reconnectTime = 4;                             // 每次重连的重连间隔 >= reconnectTime
      ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

      oWebControl.JS_RequestInterface({
        funcName: "init",
        argument: JSON.stringify({
          appkey: appkey,                            //API网关提供的appkey
          secret: secret,                            //API网关提供的secret
          ip: ip,                                    //API网关IP地址
          playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
          port: port,                                //端口
          snapDir: snapDir,                          //抓图存储路径
          videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
          layout: layout,                            //布局
          enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
          encryptedFields: encryptedFields,          //加密字段
          showToolbar: showToolbar,                  //是否显示工具栏
          showSmart: showSmart,                      //是否显示智能信息
          buttonIDs: buttonIDs                       //自定义工具条按钮
          //reconnectTimes：reconnectTimes,            //重连次数
          //reconnectDuration：reconnectTime           //重连间隔
        })
      }).then((oData) => {
        oWebControl.JS_Resize($('#playWnd').width(), $('#playWnd').height());// 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        console.log('视频回放实例初始成功')
        if (this.cameraIndexCode) {
          this.startPlayBackByTreeClick();
        }
      });
    });
  }
  // 获取公钥
  getPubKey(callback) {
    oWebControl.JS_RequestInterface({
      funcName: "getRSAPubKey",
      argument: JSON.stringify({
        keyLength: 1024
      })
    }).then((oData) => {
      if (oData.responseMsg.data) {
        this.pubKey = oData.responseMsg.data;
        callback()
      }
    })
  }

  startMultiPlaybackByCameraIndexCode() {
    var cameraIndexCode = this.formData.cameraIndexCode;        //获取输入的监控点编号值，必填
    var startTimeStamp = this.formData.startTime;
    var endTimeStamp = this.formData.startTime;        //回放结束时间戳，必填
    var recordLocation = 1;                                     //录像存储位置：0-中心存储，1-设备存储
    var transMode = 1;                                          //传输协议：0-UDP，1-TCP
    var gpuMode = 0;                                            //是否启用GPU硬解，0-不启用，1-启用
    var wndId = -1;
    oWebControl.JS_RequestInterface({
      funcName: "startMultiPlaybackByCameraIndexCode",
      argument: JSON.stringify({
        list: [
          {
            cameraIndexCode: cameraIndexCode,                   //监控点编号
            startTimeStamp: Math.floor(+startTimeStamp / 900).toString(),  //录像查询开始时间戳，单位：秒
            endTimeStamp: Math.floor(+endTimeStamp / 900).toString(),      //录像结束开始时间戳，单位：秒
            recordLocation: recordLocation,                     //录像存储类型：0-中心存储，1-设备存储
            transMode: transMode,                               //传输协议：0-UDP，1-TCP
            gpuMode: gpuMode,                                   //是否启用GPU硬解，0-不启用，1-启用
            wndId: wndId                                         //可指定播放窗口
          }
        ]
      })
    })
  }
  startMultiPreviewByCameraIndexCode() {
    var cameraIndexCode = this.liveCameraIndexCode;     //获取输入的监控点编号值，必填
    var streamMode = 0;                                     //主子码流标识：0-主码流，1-子码流
    var transMode = 1;                                      //传输协议：0-UDP，1-TCP
    var gpuMode = 0;                                        //是否启用GPU硬解，0-不启用，1-启用
    var wndId = 0;                                         //播放窗口序号（在2x2以上布局下可指定播放窗口）

    cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
    cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");
    liveWebControl.JS_RequestInterface({
      funcName: 'startMultiPreviewByCameraIndexCode',
      argument: JSON.stringify({
        list: [
          {
            cameraIndexCode,                //监控点编号
            streamMode,                         //主子码流标识
            transMode,                           //传输协议
            gpuMode,                               //是否开启GPU硬解
            // wndId                                     //可指定播放窗口
          },
          {
            cameraIndexCode,                //监控点编号
            streamMode,                         //主子码流标识
            transMode,                           //传输协议
            gpuMode,                               //是否开启GPU硬解
            // wndId                                     //可指定播放窗口
          }
        ]
      })
    })
  }
  stopMultiPlay(control) {
    control.JS_RequestInterface({
      funcName: 'stopMultiPlay',
      argument: JSON.stringify({
        list: [
          {
            wndId: 1 //窗口序号
          }
        ]
      })
    })
  }
  stopPreview() {
    liveWebControl.JS_RequestInterface({
      funcName: 'stopAllPreview'
    })
  }
  onStop() {
    oWebControl.JS_RequestInterface({
      funcName: "stopAllPlayback"
    })
  }

  // RSA加密
  private setEncrypt(value) {
    var encrypt = new (window as any).JSEncrypt();
    encrypt.setPublicKey(this.pubKey);
    return encrypt.encrypt(value);
  }
  // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
  setWndCover() {
    var iWidth = $(window).width();
    var iHeight = $(window).height();
    var oDivRect = $("#playWnd").get(0).getBoundingClientRect();

    var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
    var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
    var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
    var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

    iCoverLeft = (iCoverLeft > 900) ? 900 : iCoverLeft;
    iCoverTop = (iCoverTop > 600) ? 600 : iCoverTop;
    iCoverRight = (iCoverRight > 900) ? 900 : iCoverRight;
    iCoverBottom = (iCoverBottom > 600) ? 600 : iCoverBottom;

    oWebControl.JS_RepairPartWindow(0, 0, 1001, 600);   // 多1个像素点防止还原后边界缺失一个像素条
    if (iCoverLeft != 0) {
      oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
    }
    if (iCoverTop != 0) {
      oWebControl.JS_CuttingPartWindow(0, 0, 1001, iCoverTop);  // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
    }
    if (iCoverRight != 0) {
      oWebControl.JS_CuttingPartWindow(900 - iCoverRight, 0, iCoverRight, 600);
    }
    if (iCoverBottom != 0) {
      oWebControl.JS_CuttingPartWindow(0, 600 - iCoverBottom, 900, iCoverBottom);
    }
  }
  // 格式化时间
  dateFormat(oDate, fmt) {
    var o = {
      "M+": oDate.getMonth() + 1, //月份
      "d+": oDate.getDate(), //日
      "h+": oDate.getHours(), //小时
      "m+": oDate.getMinutes(), //分
      "s+": oDate.getSeconds(), //秒
      "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
      "S": oDate.getMilliseconds()//毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  setLiveWndCover() {
    var iWidth = $(window).width();
    var iHeight = $(window).height();
    var oDivRect = $("#liveVideo").get(0).getBoundingClientRect();

    var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
    var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
    var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
    var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

    iCoverLeft = (iCoverLeft > 900) ? 900 : iCoverLeft;
    iCoverTop = (iCoverTop > 600) ? 600 : iCoverTop;
    iCoverRight = (iCoverRight > 900) ? 900 : iCoverRight;
    iCoverBottom = (iCoverBottom > 600) ? 600 : iCoverBottom;

    liveWebControl.JS_RepairPartWindow(0, 0, 1001, 600);   // 多1个像素点防止还原后边界缺失一个像素条
    if (iCoverLeft != 0) {
      liveWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
    }
    if (iCoverTop != 0) {
      liveWebControl.JS_CuttingPartWindow(0, 0, 1001, iCoverTop);  // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
    }
    if (iCoverRight != 0) {
      liveWebControl.JS_CuttingPartWindow(900 - iCoverRight, 0, iCoverRight, 600);
    }
    if (iCoverBottom != 0) {
      liveWebControl.JS_CuttingPartWindow(0, 600 - iCoverBottom, 900, iCoverBottom);
    }
  }

  /**
   * @description: 点击左侧树相关逻辑
   * @param {*}
   * @return {*}
   */
  public onDataUpdated() {
    this.ctx.detectChanges();
  }
  private listenRouterChange() {
    this.routerLister$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((res: any) => {
      const device = this.ctx.stateController.getStateParams();

      this.selectedNode.name = device.name;
      this.selectedNode.channelNo = device.channelNo;
      if (this.activeName === ITabsLabel.live) {
        this.startPreviewByTreeClick();
      } else {
        this.startPlayBackByTreeClick();
      }
    })
  }
}
