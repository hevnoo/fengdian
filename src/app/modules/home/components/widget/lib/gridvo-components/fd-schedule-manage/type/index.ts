import { DialogEmiterType } from "../enum/enum";
import { FormGroup } from "@angular/forms";

export interface IScheduleData {
  isCheck: boolean;
  id: number;
  name: string;
  phone: string | number;
  workShfit: string;
  workTime: string;
  disabled: boolean;
  slotName?: string;
  createrId?: string;
  networkId?: string;
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
  // 数据总数
  listSize: number;
  // 当前多少页索引
  nzPageIndex: number;
  // 展示几行元素
  nzPageSize: number;
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

export interface IPlaceHolderConfig {
  name: string;
  workShfit: string | number;
  workTime: Date;
  phone: string | number;
  networkId: string;
}
