import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { WidgetContext } from '@home/models/widget-component.models';
import { WidgetConfig } from '@shared/models/widget.models';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import Cookies from 'js-cookie';
import { NzModalService } from 'ng-zorro-antd/modal';

import { HikVideoService } from "../../common/services/hik-video.service";
interface ISelectedNode {
  ip: string;
  port: number;
  username: string;
  password: string;
}

/**
 * @description: 无插件版本视频监控
 * @param {*}
 * @return {*}
 */
@Component({
  selector: 'tb-hk-video',
  templateUrl: './hk-video.component.html',
  styleUrls: ['./hk-video.component.scss']
})
export class HkVideoComponent implements OnInit {
  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;

  routerLister$: Subscription = null;

  sliderSwitchText = ['视频监控', '视频回放'];// 切换视频监控和视频回放
  activeTab: string = '视频监控';

  nvrDeviceInfo = this.HikVideoService.nvrDeviceInfo;
  iDevicePort = this.HikVideoService.iDevicePort;
  iRTSPPort = this.HikVideoService.iRTSPPort;
  selectedWnd = this.HikVideoService.selectedWnd;
  szDeviceIdentify = this.HikVideoService.szDeviceIdentify;
  iStreamType = this.HikVideoService.iStreamType;
  simulateChannels = this.HikVideoService.simulateChannels;
  digitalChannels = this.HikVideoService.digitalChannels;
  zeroChannels = this.HikVideoService.zeroChannels;
  spliceCount = this.HikVideoService.spliceCount;
  isPTZShow = this.HikVideoService.isPTZShow;
  PTZControl = this.HikVideoService.PTZControl;
  pbControl = this.HikVideoService.pbControl;
  selectChannel = this.HikVideoService.selectChannel;
  selectStyle
  // isOpenVoice: boolean = true;
  selectedNode: ISelectedNode = { // 点击左侧树 选择的设备
    // channel: 1,
    ip: '10.0.1.64',
    username: 'admin',
    password: 'Gewu2066',
    port: 80
  };

  // 默认播放
  defaultPlay: any = [{ deviceName: '' }];

  constructor(private router: Router,
    private HikVideoService: HikVideoService,
    private modal: NzModalService) { }

  ngOnDestroy(): void {
    // window.document.removeEventListener("resize", this.resizeWindow);
    this.HikVideoService.nvrLogout().then(_ => {
      console.log('nvr退出登录成功');
      // BUG 有些窗口停止播放会失败
      this.HikVideoService.stopAllPlay();
      this.HikVideoService.digitalChannels = [];
      this.digitalChannels = this.HikVideoService.digitalChannels;
    })
  }
  ngOnInit(): void {
    this.ctx.$scope.hkVideoWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
    this.listenRouterChange(); // 监听路由变化，获取stateParams；

    Cookies.remove("webVideoCtrlProxy");
    this.HikVideoService.resizeClassName = 'liveVideoParent';
    this.getTreeChannel(this.ctx.data);
    this.HikVideoService.initPlugin("liveVideo", 2);
    console.log('this.defaultPlay :>> ', this.defaultPlay);
    this.HikVideoService.nvrLogin(this.defaultPlay);
  }

  private initWidgetConfig() {
    if (typeof (this.widgetConfig.settings.szIP) === 'undefined') {
      this.modal.error({
        nzTitle: '设备未接入',
        nzContent: '暂无监控信息'
      });
    }
    this.HikVideoService.nvrDeviceInfo.ip = this.widgetConfig.settings.szIP;
    this.HikVideoService.nvrDeviceInfo.port = this.widgetConfig.settings.szPort;
    this.HikVideoService.nvrDeviceInfo.username = this.widgetConfig.settings.szUsername;
    this.HikVideoService.nvrDeviceInfo.password = this.widgetConfig.settings.szPassword;
    this.selectStyle = this.widgetConfig.settings.selectStyle
  }

  // 切换视频监控和回放
  handleSliderSwitch(tab: string) {
    this.activeTab = tab;
    if (tab === '视频监控') {
      this.HikVideoService.changeWndNum(this.HikVideoService.spliceCount);
    } else {
      this.HikVideoService.changeWndNum(1);
      this.HikVideoService.isPTZShow = true;
      this.isPTZShow = this.HikVideoService.isPTZShow;
      setTimeout(() => {
        this.HikVideoService.resizeWindow();
      }, 16);
    }
  }

  // 窗口分割数
  changeWndNum(iType) {
    this.HikVideoService.changeWndNum(iType);
    this.isPTZShow = this.HikVideoService.isPTZShow;
    this.spliceCount = this.HikVideoService.spliceCount;
  }

  // 打开声音或关闭声音
  /* clickSound() {
    console.log('this.selectedWnd :>> ', this.selectedWnd);
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szInfo = "";
    console.log('oWndInfo :>> ', oWndInfo);
    if (oWndInfo != null) {
      if (this.isOpenVoice) {
        var allWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus();
        // 循环遍历所有窗口，如果有窗口打开了声音，先关闭
        for (let i = 0, iLen = allWndInfo.length; i < iLen; i++) {
          oWndInfo = allWndInfo[i];
          if (oWndInfo.bSound) {
            (window as any).WebVideoCtrl.I_CloseSound(oWndInfo.iIndex);
            break;
          }
        }

        let iRet = (window as any).WebVideoCtrl.I_OpenSound();

        if (0 == iRet) {
          szInfo = "打开声音成功！";
          this.isOpenVoice = !this.isOpenVoice;
        } else {
          szInfo = "打开声音失败！";
        }
        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
        this.message.success(szInfo);
      } else {
        let iRet = (window as any).WebVideoCtrl.I_CloseSound();
        if (0 === iRet) {
          szInfo = "关闭声音成功！";
          this.isOpenVoice = !this.isOpenVoice;
          this.message.success(szInfo);
        } else {
          szInfo = "关闭声音失败！";
        }
        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
      }
    }
  } */
  // 设置音量
  /* clickSetVolume() {
    var oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szInfo = "";

    if (oWndInfo != null) {
      var iRet = (window as any).WebVideoCtrl.I_SetVolume(this.PTZControl.volume);
      if (0 == iRet) {
        szInfo = "音量设置成功！";
      } else {
        szInfo = "音量设置失败！";
      }
      console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
  } */

  // 抓图
  clickCapturePic() {
    this.HikVideoService.clickCapturePic();
  }

  // 全屏
  fullScreen() {
    // window.document.addEventListener("keyup", fullScreenLister);
    this.HikVideoService.fullScreen();
    // setTimeout(() => {
    //   this.mouseDownPTZControl(11);
    // }, 16);

    // function fullScreenLister(e: KeyboardEvent) {
    //   if (e.key === 'Escape') {
    //     (window as any).WebVideoCtrl.I_FullScreen(false);
    //     window.document.removeEventListener("keyup", fullScreenLister);
    //   }
    // }
  }

  // 是否显示控制台
  handlePTZShow() {
    this.HikVideoService.isPTZShow = !this.HikVideoService.isPTZShow;
    this.isPTZShow = this.HikVideoService.isPTZShow;
    console.log('this.isPTZShow :>> ', this.isPTZShow);
    setTimeout(() => {
      this.HikVideoService.resizeWindow();
    }, 16);
  }

  // PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
  mouseDownPTZControl(direction) {
    this.HikVideoService.mouseDownPTZControl(direction);
  }
  // 方向PTZ停止
  mouseUpPTZControl() {
    this.HikVideoService.mouseUpPTZControl();
  }

  // 速度改变
  speedChange(speed) {
    this.HikVideoService.PTZControl.speed = speed;
    this.PTZControl.speed = this.HikVideoService.PTZControl.speed;
  }

  // 音量改变
  /* onSoundChange() {
    let oWndInfo = (window as any).WebVideoCtrl.I_GetWindowStatus(this.selectedWnd),
      szInfo = "";

    if (oWndInfo != null) {
      var iRet = (window as any).WebVideoCtrl.I_SetVolume(this.PTZControl.volume);
      if (0 == iRet) {
        szInfo = "音量设置成功！";
      } else {
        szInfo = "音量设置失败！";
      }
      console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
  } */

  // 电子放大
  handleZoomChange(zoom: boolean) {
    this.HikVideoService.handleZoomChange(zoom);
  }

  // 变倍
  PTZZoom(zoom: string) {
    this.HikVideoService.PTZZoom(zoom);
  }
  PTZZoomStop(inOut: number) {
    this.HikVideoService.PTZZoomStop(inOut);
  }

  selectChannelChange(selectChannel) {
    this.HikVideoService.selectChannelChange(selectChannel);
  }
  // 开始回放
  clickStartPlayback() {
    this.HikVideoService.clickStartPlayback();
  }
  // 停止回放
  clickStopPlayback() {
    this.HikVideoService.clickStopPlayback();
  }

  /**
   * @description: 点击左侧树相关逻辑
   * @param {*}
   * @return {*}
   */
  public onDataUpdated() {
    this.getTreeChannel(this.ctx.data);
    this.ctx.detectChanges();
  }
  getTreeChannel(data) {
    if (data.length <= 0) return;
    const deviceList = data.map(item => {
      return { deviceName: item.data[0]?.[1] };
    })
    console.log('deviceList :>> ', deviceList);
    const test = [
      {
        deviceName: '前厅大门'
      },
      {
        deviceName: '办公区大门'
      },
      {
        deviceName: '办公区球机'
      },
      {
        deviceName: '热成像01'
      },
    ]
    this.defaultPlay = test;
  }
  private listenRouterChange() {
    this.routerLister$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((res: any) => {
      const channel = this.ctx.stateController.getStateParams();
      if (channel.channelNo !== '') {
        this.HikVideoService.defaultPlay(this.HikVideoService.selectedWnd, channel.channelNo);
      }
    })
  }
}
