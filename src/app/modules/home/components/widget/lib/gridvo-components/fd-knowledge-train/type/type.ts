import { Type } from "@angular/core";
import { ComponentEmiterType } from "./enum";
export interface IImageInfo {
  src: string;
  name: string;
  width?: number; //px
  height?: number; //px
  videoUrl?: string;
  vrUrl?: string;
  questionLibrary?: string;
  pptSource?: IPPT[];
}

export class IAddImageTab {
  constructor(public component: Type<any>, public imgObjs: IImageInfo[]) {}
}
export interface IAdComponent {
  imgObjs: IImageInfo[];
}

export interface ITabInfo {
  title: string;
  slot: IAddImageTab | null;
}

export interface IBannerInfo {
  imgUrl: string;
  alt: string;
}
export interface IPPT {
  id: number;
  url: string;
}
export interface IModalConfig {
  title: string;
  videoUrl: string;
  vrUrl: any;
  questionLibrary: string;
  ppt: IPPT[];
}

export interface IProjectConfig {
  name: string;
  marks: IMarks;
  value: string;
}
export interface IMarks {
  [key: string]: string;
}

/**tab切换页信息 */
export interface IImagePageData {
  title: string;
  data: IImageInfo[];
}

export interface IImageEmiter {
  type: ComponentEmiterType;
  value: {
    flag: boolean;
    content?: IImageInfo;
  };
}

export type IDisplayType = "full" | "modal" | "vr" | "questions" | "ppt";

export interface IAllData {
  name: string;
  picture: string;
  type: string;
  videoSrc?: string;
  childType?: string;
  knowledge?: string; //知识消息，只出现一次
  examSrc?: string; //考试路径
  cloudUrl?: string; //只出现一次
  appName?: string; //只出现一次
  pptSource?: IPPT[]; //ppt资源
  vrUrl?: string;
}

export interface IMoreImageEmiterType {
  type: ComponentEmiterType;
  value: {
    flag: boolean;
    content?: IAllData;
  };
}
