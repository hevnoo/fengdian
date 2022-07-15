import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defaultHttpOptionsFromConfig, RequestConfig } from './http-utils';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LoginPageStyleService {
    constructor(
        private http: HttpClient
    ) {}

    // 保存登录页定制设置
    public saveLoginStyleSettings(fetchValue, config?: RequestConfig): Observable<any> {
        return  this.http.post('/api/page_pattern', fetchValue, defaultHttpOptionsFromConfig(config))
    }

    // 获得登录页样式配置
    public getLoginStyle(label: string): Observable<any> {
        const url = `/openapi/page_pattern?label=${label}`
        return this.http.get(url)
    }
}

// 组件类型枚举
export enum loginStyleTypeEnum {
    "COLOR" = "COLOR",
    "IMAGE" = "IMAGE",
    "TEXT" = "TEXT",
    "SELECT" = "SELECT"
}

// loginStyleList 的类型
export type LoginStyleType = {
    formControlName: string,
    type: loginStyleTypeEnum, // 用来判断组件类型
    label: string,
    maxSize?: number // 仅用来限制图片大小单位是byte
}

// 登录页样式列表
export const loginStyleList: Array<LoginStyleType> = [
    {
      formControlName: "backgroundImage",
      type: loginStyleTypeEnum.IMAGE,
      label: "背景图片",
      maxSize: 1048576 // 1M
    },
    {
      formControlName: "backgroundSizeMode",
      type: loginStyleTypeEnum.SELECT,
      label: "背景大小模式"
    },
    {
      formControlName: "rightLogo",
      type: loginStyleTypeEnum.IMAGE,
      label: "左侧logo",
      maxSize: 524288 // 0.5M
    },
    {
      formControlName: "rightButtonColor",
      type: loginStyleTypeEnum.COLOR,
      label: "右侧按钮颜色"
    },
    {
      formControlName: "rightButtonTextColor",
      type: loginStyleTypeEnum.COLOR,
      label: "右侧按钮文字颜色"
    },
    {
      formControlName: "leftTitle",
      type: loginStyleTypeEnum.TEXT,
      label: "上侧标题"
    },
    {
      formControlName: "leftTitleColor",
      type: loginStyleTypeEnum.COLOR,
      label: "上侧标题颜色"
    },
]
