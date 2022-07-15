import { Inject, Injectable } from '@angular/core';
import moment from 'moment';
import { isMobile } from "@core/utils";
import { AuthService } from '../auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { iif, Observable, Observer, Subject, of, BehaviorSubject } from 'rxjs';
import { timeout, catchError } from "rxjs/operators";
import { NzMessageService } from 'ng-zorro-antd/message';
import { WINDOW } from '@core/services/window.service';
import { NzModalService } from 'ng-zorro-antd/modal';
export enum CameraType {
  takePhotos = 1,
  album = 2,
}
@Injectable({
  providedIn: 'root'
})
export class GridvoMobileService {
  readonly isMobile: boolean = isMobile();

  GridvoChatApp: any = (this.window as any).GridvoChatApp;

  queue = new Map<string, Subject<any>>();

  redirectUrl$ = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService,
    private modal: NzModalService,
    @Inject(WINDOW) private window: Window
  ) { }

  /**
     * @description: 检测是否是移动端并且 window下面有没有GridvoChatApp埋点
     * @param {*}
     * @return {*}
     */
  isGridvoChatApp(): boolean {
    return isMobile() && typeof (this.GridvoChatApp) !== 'undefined';
  }

  injectFn() {
    (this.window as any).GridvoChatAppCallback = function (requestId, method, payload) {
      const WebviewCB$ = this.queue.get(requestId);
      if (!WebviewCB$) return;
      this.queue.delete(requestId);
      let jsonOjb = {};
      if (payload) {
        jsonOjb = JSON.parse(payload);
      }
      WebviewCB$.next(payload);
      WebviewCB$.complete();
    }.bind(this);
  }
  /**
   * @description: 打开摄像机
   * @param {*} 1 拍照 2 打开相册
   * @return {*} {"data":"/group1/startalk/e4db9b5deb105e6fc325d8840bcd77ee.jpg","status":200,"timestamp":"Mar 23, 2022 15:58:50"}
   */
  openCamera(num: CameraType): Observable<any> {
    const reqId = this.GridvoChatApp.takePictureFuture(num);
    const imgUrl$ = new Subject();
    this.queue.set(reqId, imgUrl$);
    return imgUrl$.asObservable().pipe(
      timeout(60 * 1000),
      catchError(() => {
        this.queue.delete(reqId);
        return of(500);
      })
    );
  }
  /**
   * @description: 获取当前用户的tb Token
   * @param {*}
   * @return {*}
   */
  getThingsBoardToken() {
    const tokenObj = this.GridvoChatApp.getThingsBoardToken();
    let response;
    if (tokenObj) {
      response = JSON.parse(tokenObj);
    }
    if(typeof(response) !== 'undefined' && response.status === 200) {
      this.authService.redirectUrl = this.redirectUrl$.getValue();
      this.authService.mobileLogin(response.data.token, response.data.refreshToken);
    } else {
      const modal = this.modal.create({
        nzTitle: '授权失败',
        nzContent: '是否重新授权?',
        nzClosable: false,
        nzMaskClosable: false,
        nzMaskStyle: { backgroundColor: 'rgba(255, 255, 255, 0.5)', filter: 'blur(30px)' },
        nzOnOk: () => {
          modal.destroy();
          modal.afterClose.asObservable().subscribe(() => {
            this.getThingsBoardToken();
          })
        },
        nzOnCancel: () => {
          modal.destroy();
        }
      });
    }
  }
  /**
   * @description: 视频通话 - 通过域和账号
   * @param {*tenant 租户}
   * @param {*user 租户下的用户}
   * @return {*}
   */
  videoCallByUser(tenant: string, user: string) {
    this.GridvoChatApp.videoCallByUser(tenant, user);
  }
  /**
   * @description: 视频通话 - 通过Tings Board 用户Id
   * @param {*userId 用户Id}
   * @return {*}
   */
  videoCallByTbUserId(userId) {
    this.GridvoChatApp.videoCallByTbUserId(userId);
  }
}
