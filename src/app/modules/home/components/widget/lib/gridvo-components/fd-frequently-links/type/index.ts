import { FormGroup } from "@angular/forms";
import { DialogEmiterType, DialogEmiterName } from "../enum/enum";

export interface IFrequentlyLink {
  isCheck: boolean;
  id: number;
  systemName: string;
  link: string;
  linkType: string;
  remarks: string;
  creater: string;
  createTimes: Date | string;
  disabled: boolean;
  slotName?: string;
}

/**theader的配置选项 */
export interface IThProp {
  prop: string;
  label: string;
  minWidth: string | null;
  nzAlign: "left" | "right" | "center";
}
/**paginationData:tbody的配置项 */
export interface IPaginationConfigData {
  /** 数据总数*/
  listSize: number;
  /**当前多少页索引 */
  nzPageIndex: number;
  /** 展示几行元素*/
  nzPageSize: number;
}

/*预显示信息类型*/
export interface IFormShowPlaceHolderConfig {
  systemName: string;
  link: string;
  linkType: string;
  /**备注 */
  remarks: string;
  creater: string;
  createTimes: string | Date;
}

/**Dialog外部发送数据类型。*/
export interface IDialogEmiter {
  type: DialogEmiterType;
  value: {
    flag: boolean;
    content?: FormGroup;
    name?: string;
  };
}
