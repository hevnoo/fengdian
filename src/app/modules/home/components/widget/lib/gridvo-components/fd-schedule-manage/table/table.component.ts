import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";

import { FormGroup } from "@angular/forms";
import { AddComponent } from "../add/add.component";
import { ModifyComponent } from "../modify/modify.component";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

import { debounce } from "@gwhome/common/utils/debounce";
import { GfDayUtils } from "@gwhome/common/utils/day-utils-class";
import type {
  IScheduleData,
  IThProp,
  IPaginationConfigData,
  IDialogEmiter,
  IPlaceHolderConfig,
} from "../type";

import { DialogEmiterType } from "../enum/enum";
import { ScheduleManageService } from "@core/http/schedule-manage.service";
import localStorage from "../../common/utils/Cache";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "fd-tb-schedule-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {
  inputValue: string | null = null;
  textValue: string | null = null;

  constructor(
    private modal: NzModalService,
    private schduleService: ScheduleManageService,
    private cd: ChangeDetectorRef,
    private message: NzMessageService
  ) {}

  /**从上到下依次是:checked:是否选中(单个),loading:table是否是加载状态,indeterminate:当前列表是否有任意一个选中*/
  /**listOfData:源数据.listOfDisplayData:展示数据,listOfCurrentPageData:当前页面展示的数据*/
  /**setOfCheckedId:选中的集合(id作为标准).allChecked:是否全选(th),searchValue:搜索框的值双向数据绑定*/
  /**propList:theader的配置选项,paginationData:tbody的配置项*/
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly IScheduleData[] = [];
  listOfDisplayData: IScheduleData[] = [];
  listOfCurrentPageData: readonly IScheduleData[] = [];
  setOfCheckedId = new Set<number>();
  allChecked = false;
  searchValue: string = "";
  propList: IThProp[] = [];
  paginationData!: IPaginationConfigData;

  /**
   * formAdd添加按钮弹窗。formShowOrChange修改按钮弹窗，或者详情信息弹窗。
   * formAddConfig：添加按钮弹窗配置文件.formShowConfig:修改按钮弹窗配置文件。
   * formShowPlaceHolderConfig：展示弹窗提示消息配置
   */
  @ViewChild("dialogA", { static: true })
  formAdd!: ElementRef<AddComponent>;
  @ViewChild("dialogB", { static: true })
  formShowOrChange!: ElementRef<ModifyComponent>;
  formAddConfig = { isVisible: false, tplModalButtonLoading: false };
  formShowConfig = { isVisible: false, tplModalButtonLoading: false };

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
    listOfCurrentPageData: readonly IScheduleData[]
  ): void {
    // this.listOfCurrentPageData = listOfCurrentPageData;
    this.listOfCurrentPageData = listOfCurrentPageData.map((item, index) => {
      item.id = index + 1;
      return item;
    });
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

  /** 输入框搜索按钮的响应事件*/
  inputSearch() {
    // 判断输入字符串是否为空格
    if (new RegExp("^[ ]+$").test(this.searchValue)) {
      this.searchValue = "";
      this.message.create("error", "条件为空格，请重新输入", {
        nzDuration: 2000,
      });
      return;
    }
    this.listOfDisplayData = this.listOfData.filter(
      (item) => item.name.indexOf(this.searchValue) !== -1
    );
    this.listOfDisplayData.forEach((item, index) => {
      item.id = index + 1;
    });
    this.paginationData.listSize = this.listOfDisplayData.length;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /*操作对话框方法，显示或者隐藏dialog-add和dialog-modify*/
  operationDialog(dialogName: "add" | "modify" | "delete"): void {
    let formShowLine;
    switch (dialogName) {
      case "add":
        this.formAddConfig.isVisible = true;
        break;
      case "modify":
        formShowLine = this.listOfCurrentPageData.filter(
          (item) => item.id === Array.from(this.setOfCheckedId)[0]
        );
        this.formShowConfig.isVisible = true;
        this.patchValueForModifyDialog(formShowLine[0]);
        break;
      case "delete":
        this.deleteOpen();
        break;
      default:
        const exhaustiveCheck = dialogName;
    }
  }

  /**
   * 关闭弹窗方法
   * @param isVisiable 子组件传递过来的值，用于关闭弹窗
   */
  handleCancel({ type, value }: IDialogEmiter): void {
    this.loading = true;
    switch (type) {
      case DialogEmiterType.ADD:
        this.formAddConfig.isVisible = value.flag;
        if (value.content) {
          this.schduleService
            .patchScheduleData(
              this.getAllRequstParams(value.content, DialogEmiterType.ADD)
            )
            .subscribe({
              next: () => {
                this.requestAnnouncement(0, this.totalElements + 1);
                this.message.create("success", "添加成功", {
                  nzDuration: 1000,
                });
                this.loading = false;
              },
              error: () => {
                console.log("出错了");
              },
              complete: () => {
                console.log("终止监听");
              },
            });
        }
        break;
      case DialogEmiterType.ADD_DESTORY:
        this.formAddConfig.isVisible = value.flag;
        value.content.reset();
        this.loading = false;
        break;
      case DialogEmiterType.MODIFY:
        this.formShowConfig.isVisible = value.flag;
        this.schduleService
          .patchScheduleData(
            this.getAllRequstParams(value.content, DialogEmiterType.MODIFY)
          )
          .subscribe({
            next: () => {
              this.requestAnnouncement(0, this.totalElements);
              this.message.create("success", "修改成功", { nzDuration: 1000 });
              this.loading = false;
            },
            complete: () => {
              console.log("终止");
              this.requestAnnouncement(0, this.totalElements);
            },
            error: () => {
              console.log("出错了");
            },
          });
        break;
      case DialogEmiterType.MODIFY_DESTORY:
        this.formShowConfig.isVisible = value.flag;
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
    if (type === DialogEmiterType.ADD) {
      const submitObj = formGroup.getRawValue();
      submitObj.workShfit = this.schduleService.getType(submitObj.workShfit);
      const preDefineObj = this.schduleService.assignPreIScheduleData(1);
      const resultObj = Object.assign(preDefineObj, submitObj) as IScheduleData;
      formGroup.reset(); //清空添加弹窗表单数据
      return resultObj;
    } else {
      const updataObj = formGroup.getRawValue();
      updataObj.workTime = updataObj.workTime.getTime();
      updataObj.workShfit = this.schduleService.getType(updataObj.workShfit);
      const preDefineObj = this.schduleService.assignPreIScheduleData(1);
      const resultObj = Object.assign(preDefineObj, updataObj) as IScheduleData;
      return resultObj;
    }
  }

  /**
   * @param scheduleInfo 传入的排班管理对象
   * @returns 返回对象所有的键，string[]
   */
  tdCheckLabel(scheduleInfo: IScheduleData) {
    return Object.keys(scheduleInfo);
  }

  /**
   * @param announcement 排班管理对象
   * @param key 键名
   * @returns 排班管理对象键名对应的值。announcement[id]
   */
  tdFormateLabel(scheduleInfo: IScheduleData, key: string) {
    return (scheduleInfo as any)[key];
  }
  verifyDisplay(key: string) {
    return (
      key !== "slotName" &&
      key !== "disabled" &&
      key !== "networkId" &&
      key !== "createrId" &&
      key !== "completeEnclosure"
    );
  }
  /**table页面发生变化调用 */
  pageSizeChange(size: number) {
    this.paginationData.nzPageSize = size;
  }

  /**
   * 单击行响应事件
   * @param id 单行date的id值
   */
  trChecked(id: number) {
    this.setOfCheckedId.clear();
    this.updateCheckedSet(id, !this.setOfCheckedId.has(id));
    this.refreshCheckedStatus();
    this.indeterminate = true;
  }
  /**
   * 双击响应事件
   * @param id 单行date的id值
   * @param data 单行data
   */
  trDoubleChecked(id: number, data: IScheduleData) {
    if (!this.setOfCheckedId.has(id)) {
      this.updateCheckedSet(id, !this.setOfCheckedId.has(id));
      this.refreshCheckedStatus();
    }
    const resultForm = (this.formShowOrChange as any)[
      "showValidateForm"
    ] as FormGroup;
    this.operationDialog("modify");
  }

  /**
   * 选中单行数据修改按钮调用，或者是双击单行数据调用
   * @param data 选中的单行数据
   */
  patchValueForModifyDialog(data: IScheduleData) {
    const lineSchedule: IPlaceHolderConfig = {
      name: data.name,
      phone: data.phone,
      workTime: new Date(GfDayUtils.getTimeForString(data.workTime)),
      workShfit: this.schduleService.getTypeValue(data.workShfit),
      networkId: data.networkId,
    };
    const resultForm = (this.formShowOrChange as any)[
      "showValidateForm"
    ] as FormGroup;
    resultForm.patchValue({ ...lineSchedule });
  }

  /**加载theader配置选项 */
  loadTheaderConfig() {
    /**
     * 样式百分比从左到右
     * 0.033+0.030+0.11+0.055+0.193+0.192+0.192+0.192
     */
    this.propList = [
      { prop: "check", label: "选中", minWidth: "3.5%", nzAlign: "center" },
      { prop: "id", label: "序号", minWidth: "3.5%", nzAlign: "center" },
      { prop: "theme", label: "值班人员", minWidth: "23%", nzAlign: "center" },
      { prop: "type", label: "联系电话", minWidth: "24%", nzAlign: "center" },
      { prop: "content", label: "班次", minWidth: "23%", nzAlign: "center" },
      {
        prop: "disabled",
        label: "值班时间",
        minWidth: "23%",
        nzAlign: "center",
      },
    ];
  }
  /**加载分页数据 */
  loadPagination(size: number = 10) {
    /**listSize总共的数据，nzPageIndex：当前选中的页数 ，
     * nzPageSize：当前页数展示多少行数据*/
    this.paginationData = {
      listSize: size,
      nzPageIndex: 1,
      nzPageSize: 10,
    };
  }
  // 创建提示框
  confirmModal?: NzModalRef;
  deleteOpen() {
    this.confirmModal = this.modal.confirm({
      nzTitle: "提示",
      nzContent: "您确定要删除吗?",
      nzOnOk: () => {
        this.loading = true; //加载提示，加载中
        const formShowLine = this.listOfCurrentPageData.filter(
          (item) => item.id === Array.from(this.setOfCheckedId)[0]
        );
        this.schduleService.deleteAnnoucement(formShowLine[0]).subscribe({
          next: (res) => {
            // console.log("res", res);
            this.requestAnnouncement();
            this.message.create("success", "删除成功", { nzDuration: 1000 });
            this.loading = false;
          },
          complete: () => {
            console.log("终止监听");
            this.requestAnnouncement();
          },
          error: () => {
            console.log("错误");
          },
        });
        this.setOfCheckedId.clear();
      },
      nzOnCancel: () => {
        this.setLoading();
      },
    });
  }

  totalElements: number =
    parseInt(localStorage.getCache("scheduleTotal")) || 100;
  requestAnnouncement(page = 0, pageSize = this.totalElements) {
    this.schduleService.getPaging(page, pageSize).subscribe((res: any) => {
      const _data = this.schduleService.bubbleSort(res.data, false);
      this.totalElements = res.totalElements;
      localStorage.setCache("scheduleTotal", this.totalElements);
      this.listOfData = this.schduleService.mapIScheduleData(_data);
      // @ts-ignore
      this.listOfDisplayData = [...this.listOfData];
      this.paginationData.listSize = res.totalElements;
      this.setLoading();
    });
  }

  /**修改状态并刷新 */
  setLoading(loading = false) {
    this.loading = loading;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.loadTheaderConfig();
    this.loadPagination();
    /**赋值防抖函数 */
    this.inputSearch = debounce(this.inputSearch, 500, true);
    this.requestAnnouncement();
  }
}
