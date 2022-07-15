import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { AssetService } from "@core/http/asset.service";
import { AttributeService } from "@core/http/attribute.service";
import {
  AttributeScope,
  AttributeData,
} from "@shared/models/telemetry/telemetry.models";
import type { EntityId } from "@shared/models/id/entity-id";
import { EntityType } from "@shared/models/entity-type.models";

import { DialogAddComponent } from "./dialog/dialog-add/dialog-add.component";
import { DialogModifyComponent } from "./dialog/dialog-modify/dialog-modify.component";
import type {
  IFrequentlyLink,
  IThProp,
  IPaginationConfigData,
  IFormShowPlaceHolderConfig,
  IDialogEmiter,
} from "./type";
import { DialogEmiterType } from "./enum/enum";
import { debounce } from "@gwhome/common/utils/debounce";
import { dateFormat } from "@gwhome/common/utils/day-utils-func";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { parseISO } from "date-fns";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "tb-fd-frequently-links",
  templateUrl: "./fd-frequently-links.component.html",
  styleUrls: ["./fd-frequently-links.component.scss"],
})
export class FdFrequentlyLinksComponent implements OnInit {
  /**
   * @param assetService 请求链接服务
   * @param attributeService 链接增删改查服务
   */
  constructor(
    private assetService: AssetService,
    private attributeService: AttributeService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  /**从上到下依次是:checked:是否选中(单个),loading:table是否是加载状态,indeterminate:当前列表是否有任意一个选中*/
  /**listOfData:源数据.listOfDisplayData:展示数据,listOfCurrentPageData:当前页面展示的数据*/
  /**setOfCheckedId:选中的集合(id作为标准).allChecked:是否全选(th),searchValue:搜索框的值双向数据绑定*/
  /**propList:theader的配置选项,paginationData:tbody的配置项*/
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly IFrequentlyLink[] = [];
  listOfDisplayData: IFrequentlyLink[] = [];
  listOfCurrentPageData: readonly IFrequentlyLink[] = [];
  setOfCheckedId = new Set<number>();
  allChecked = false;
  searchValue: string = "";
  propList: IThProp[] = [];
  paginationData!: IPaginationConfigData;
  successText: string = "";

  /**
   * formAdd添加按钮弹窗.formModifyOrChange:修改按钮弹窗，或者详情信息弹窗。
   * formAddConfig:添加按钮弹窗配置文件.formModifyConfig:修改按钮弹窗配置文件。
   * formModifyPlaceHolderConfig:展示弹窗提示消息配置,confirmModal：弹窗
   */
  @ViewChild("dialogAdd", { static: true })
  formAdd!: ElementRef<DialogAddComponent>;
  @ViewChild("dialogModify", { static: true })
  formModifyOrChange!: ElementRef<DialogModifyComponent>;
  formAddConfig = { isVisible: false, tplModalButtonLoading: false };
  formModifyConfig = { isVisible: false, tplModalButtonLoading: false };
  formModifyPlaceHolderConfig: IFormShowPlaceHolderConfig = {
    systemName: "",
    link: "",
    linkType: "",
    remarks: "",
    creater: "",
    createTimes: "",
  };
  confirmModal?: NzModalRef;

  /* 操作ThingsBoard的数据，存储类型（这里是资产类型）和Id号*/
  assetType: EntityId = {
    entityType: EntityType.ASSET,
    id: null,
  };
  /**保存选中的链接数组用于增删改查 */
  currenRequestAttrbute: AttributeData[] = [];
  /**
   * @param id 更新选中的Set集合这里指 setOfCheckedId
   * @param checked 选中状态，一般根据选中状态做取反操作。
   */
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  /**
   * @param listOfCurrentPageData table当前页面数据发生改变的回调函数
   */
  onCurrentPageDataChange(
    listOfCurrentPageData: readonly IFrequentlyLink[]
  ): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  /**刷新选中样式算法，包含所有id，只包含check，只要选中一个更改indeterminate属性*/
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(
      ({ disabled }) => !disabled
    );
    this.allChecked = listOfEnabledData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
    this.indeterminate = listOfEnabledData.some(
      ({ id }) => !this.allChecked && this.setOfCheckedId.has(id)
    );
  }

  /**
   * @param id IData的实例中的id属性
   * @param checked tbody中传过来的$event对象
   */
  onItemChecked(id: number, checked: boolean): void {
    this.setOfCheckedId.clear();
    this.updateCheckedSet(id, !this.setOfCheckedId.has(id));
    this.refreshCheckedStatus();
  }

  /**
   * 全选按钮的响应事件，也是根据选中状态来进行取反操作。
   * @param checked 是否选中
   */
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  /*操作对话框方法，显示或者隐藏dialog-add和dialog-modify*/
  operationDialog(dialogName: "add" | "modify" | "delete"): void {
    this.loading = true;
    let filterLink;
    switch (dialogName) {
      case "add":
        this.formAddConfig.isVisible = true;
        this.successText = "添加成功！";
        break;
      case "modify":
        this.successText = "修改成功！";
        filterLink = this.listOfCurrentPageData.filter(
          (item) => item.id === Array.from(this.setOfCheckedId)[0]
        );
        this.patchValueForModifyDialog(filterLink[0]);
        this.formModifyConfig.isVisible = true;
        break;
      case "delete":
        this.successText = "删除成功！";
        // this.formModifyConfig.isVisible = true;
        this.showConfirm();
        break;
      default:
        const exhaustiveCheck = dialogName;
    }
  }

  /**显示对话框消息 */
  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: "提示",
      nzContent: "您确定要删除吗？",
      nzOnOk: () => {
        this.deleteLinks();
      },
      nzOnCancel: () => {
        this.loading = false;
        this.cd.markForCheck();
        this.cd.detectChanges();
      },
    });
  }

  /**
   * 用于请求ThingsBoard中之前部署好的资产类型数据。
   * @param name 资产类型名称
   */
  requestLinks(name: string = "link-manage") {
    this.assetService.findByName(name).subscribe((result) => {
      this.assetType.id = result.id.id;
      this.attributeService
        .getEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE)
        .subscribe((result2) => {
          if (result2.length > 0) {
            this.currenRequestAttrbute = result2;
            const result = new MatTableDataSource<IFrequentlyLink>(
              this.currenRequestAttrbute[0].value
            );
            this.listOfData = result.filteredData;
            // @ts-ignore
            this.listOfDisplayData = [...this.listOfData];
            this.loadPagination();
            this.loading = false;
            this.cd.markForCheck();
            this.cd.detectChanges();
          }
        });
    });
  }
  /**
   * 关闭Add弹窗方法
   * @param isVisiable 子组件传递过来的值，包括表单值和关闭弹窗值。
   */
  handleDialogCancel({ type, value }: IDialogEmiter): void {
    switch (type) {
      case DialogEmiterType.ADD:
        this.formAddConfig.isVisible = value.flag;
        if (value.content) {
          this.patchLinks(
            this.getAllRequstParams(value.content, DialogEmiterType.ADD),
            DialogEmiterType.ADD
          );
        }
        break;
      case DialogEmiterType.ADD_DESTORY:
        this.formAddConfig.isVisible = value.flag;
        this.loading = false;
        break;
      case DialogEmiterType.MODIFY:
        // console.log(value.content?.get('linkType')?.value);
        this.formModifyConfig.isVisible = value.flag;
        if (value.content) {
          this.patchLinks(
            this.getAllRequstParams(value.content, DialogEmiterType.MODIFY),
            DialogEmiterType.MODIFY
          );
        }
        break;
      case DialogEmiterType.MODIFY_DESTORY:
        this.formModifyConfig.isVisible = value.flag;
        this.loading = false;
        break;
      default:
        const exhaustiveCheck: never = type;
        break;
    }
  }

  /**
   * 获取子弹窗验证成功的值,并合并.
   * @param formGroup 子弹窗验证通过的表单组
   * @returns 合并之后的IFrequentlyLink对象
   */
  getAllRequstParams(formGroup: FormGroup, type: DialogEmiterType) {
    const submitObj = formGroup.getRawValue();
    submitObj.linkType =
      submitObj.linkType === "personalLink" ? "个人链接" : "公共链接";
    let id: number;
    if (type === DialogEmiterType.MODIFY) {
      id = Array.from(this.setOfCheckedId)[0];
    } else {
      id = this.listOfDisplayData.length + 1;
      formGroup.reset();
    }
    const preDefineObj: IFrequentlyLink = {
      isCheck: false,
      id: id,
      systemName: "",
      link: "",
      linkType: "",
      remarks: "",
      creater: "admin",
      createTimes: dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"),
      disabled: false,
    };
    const resultObj = Object.assign(preDefineObj, submitObj) as IFrequentlyLink;
    return resultObj;
  }
  /**
   * 更新本地的展示表格信息
   * @param submitObj 合并后的IFrequentlyLink对象
   */
  patchLinks(submitObj: IFrequentlyLink, type: DialogEmiterType) {
    const copyList = Array.from(this.listOfDisplayData);
    if (type === DialogEmiterType.ADD) {
      copyList.unshift(submitObj);
      const mapList = copyList.map((item, index) => {
        item.id = index + 1;
        return item;
      });
      this.currenRequestAttrbute[0].value = mapList;
    } else if (type === DialogEmiterType.MODIFY) {
      const mapList = copyList.map((item) => {
        if (item.id === Array.from(this.setOfCheckedId)[0]) {
          item = submitObj;
          return item;
        }
        return item;
      });
      this.currenRequestAttrbute[0].value = mapList;
    }
    /**进行服务器端保存数据 */
    this.saveAttributeService(this.currenRequestAttrbute);
  }

  deleteLinks() {
    let copyList = Array.from(this.listOfDisplayData);
    copyList = copyList.filter((item) => {
      if (item.id !== Array.from(this.setOfCheckedId)[0]) {
        return item;
      }
    });
    // 排序
    const mapList = copyList.map((item, index) => {
      item.id = index + 1;
      return item;
    });
    this.currenRequestAttrbute[0].value = mapList;
    this.saveAttributeService(this.currenRequestAttrbute);
  }
  /**
   * 进行服务器端数据保存
   * @param value 保存的值
   * @param type 类型，这里是默认资产
   * @param scope 操作类型，这里是保存
   */
  saveAttributeService(
    value = this.currenRequestAttrbute,
    type = this.assetType,
    scope = AttributeScope.SERVER_SCOPE
  ) {
    this.attributeService.saveEntityAttributes(type, scope, value).subscribe({
      next: (res: any) => {
        this.requestLinks();
        this.message.success(this.successText);
        this.setOfCheckedId.clear();
      },
      error: () => {
        this.message.error("保存失败，字段长度超出限制！");
        this.requestLinks();
      },
    });
  }

  /**
   *
   * @param announcement 传入的公告管理对象
   * @returns 返回对象所有的键，string[]
   */
  tdCheckLabel(announcement: IFrequentlyLink) {
    return Object.keys(announcement);
  }

  /**
   * @param announcement 公告管理对象
   * @param key 键名
   * @returns 公告管理对象键名对应的值。announcement[id]
   */
  tdFormateLabel(announcement: IFrequentlyLink, key: string) {
    // 序号大于10时从0重新计算
    if (key === "id") {
      let index = ((announcement as any)[key] - 1) % 10;
      return index + 1;
    } else {
      return (announcement as any)[key];
    }
  }

  /** 输入框搜索按钮的响应事件*/
  inputSearch() {
    // InputEvent console.log((e as any).target.value);
    this.listOfDisplayData = this.listOfData.filter(
      (item) => item.systemName.indexOf(this.searchValue) !== -1
    );
    this.listOfDisplayData.forEach((item, index) => {
      return (item.id = index + 1);
    });
    this.paginationData.listSize = this.listOfDisplayData.length;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
  /**table页面发生变化调用 */
  pageSizeChange(size: number) {
    this.loadPagination();
    this.paginationData.nzPageSize = size;
  }

  /**
   * 单机行响应事件
   * @param id 单行date的id值
   */
  trChecked(id: number) {
    // this.currenId = id;
    this.setOfCheckedId.clear();
    this.updateCheckedSet(id, !this.setOfCheckedId.has(id));
    this.refreshCheckedStatus();
  }
  /**
   * 双击响应事件
   * @param id 单行date的id值
   * @param data 单行data
   */
  trDoubleChecked(id: number, data: IFrequentlyLink) {
    this.setOfCheckedId.clear();
    if (!this.setOfCheckedId.has(id)) {
      this.updateCheckedSet(id, !this.setOfCheckedId.has(id));
      this.refreshCheckedStatus();
    }
    this.patchValueForModifyDialog(data);
    this.operationDialog("modify");
  }

  /**
   * 选中单行数据修改按钮调用，或者是双击单行数据调用
   * @param data 选中的单行数据
   */
  patchValueForModifyDialog(data: IFrequentlyLink) {
    const resultLinkTypeValue =
      data.linkType === "公共链接" ? "publicLink" : "personalLink";
    this.formModifyPlaceHolderConfig = {
      systemName: data.systemName,
      link: data.link,
      linkType: resultLinkTypeValue,
      remarks: data.remarks,
      creater: data.creater,
      createTimes: parseISO(data.createTimes as string),
    };
    const resultForm = (this.formModifyOrChange as any)[
      "showValidateForm"
    ] as FormGroup;
    resultForm.patchValue({ ...this.formModifyPlaceHolderConfig });
  }

  /**加载theader配置选项 */
  loadTheaderConfig() {
    /**
     * 样式百分比从左到右
     * 0.033+0.030+0.11+0.055+0.193+0.192+0.192+0.192
     */
    this.propList = [
      { prop: "check", label: "选中", minWidth: "3.5%", nzAlign: "center" },
      { prop: "id", label: "序号", minWidth: "6%", nzAlign: "center" },
      {
        prop: "systemName",
        label: "系统名称",
        minWidth: "16%",
        nzAlign: "center",
      },
      { prop: "link", label: "链接", minWidth: "16%", nzAlign: "center" },
      {
        prop: "linkType",
        label: "链接类型",
        minWidth: "13%",
        nzAlign: "center",
      },
      {
        prop: "remarks",
        label: "备注",
        minWidth: "16%",
        nzAlign: "center",
      },
      {
        prop: "creater",
        label: "创建人",
        minWidth: "13%",
        nzAlign: "center",
      },
      {
        prop: "createTimes",
        label: "创建时间",
        minWidth: "16%",
        nzAlign: "center",
      },
    ];
  }
  /**加载table数据源 */
  loadTableData() {
    this.requestLinks("link-manage");
  }
  /**加载分页数据 */
  loadPagination() {
    /**listSize总共的数据，nzPageIndex：当前选中的页数 ，
     * nzPageSize：当前页数展示多少行数据*/
    this.paginationData = {
      listSize: this.listOfDisplayData.length || 13,
      nzPageIndex: 1,
      nzPageSize: 10,
    };
  }
  ngOnInit(): void {
    this.loadTheaderConfig();
    this.loadTableData();
    this.loadPagination();
    /**赋值防抖函数 */
    this.inputSearch = debounce(this.inputSearch, 500, true);
  }
}
