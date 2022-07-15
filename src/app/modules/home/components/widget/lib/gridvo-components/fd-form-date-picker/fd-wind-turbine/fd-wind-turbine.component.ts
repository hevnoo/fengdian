import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { isDefined } from "@core/utils";
import { WidgetConfig } from "@shared/models/widget.models";
import type { StateParams } from "@core/api/widget-api.models";
import chche from "@gwhome/common/utils";
const { LocalChche } = chche;

@Component({
  selector: "tb-fd-wind-turbine",
  templateUrl: "./fd-wind-turbine.component.html",
  styleUrls: ["./fd-wind-turbine.component.scss"],
})
export class FdWindTurbineComponent implements OnInit, OnDestroy {
  @Input() ctx: WidgetContext;

  widgetConfig: WidgetConfig = {};
  allParams: StateParams[]; //绑定的全部实体数据源
  currentParams: string; //当前选择器选中的实体状态的name名称（因为直接用对象会有更新问题）
  rightDetailObj: object = {}; //用于筛选右边显示的全部数据obj
  rightCurrentData: any[] = []; //当前需要显示的右边数据
  currentState: any = {}; //获取到的仪表板状态

  // 部件可配置选项
  // public currentStateName: string = "default"
  isShowDetail: boolean = true;
  centerImgUrl: string = "";
  customStyle: string = "";
  isColumnBox: boolean = false; //数值默认是横向排列  为true则纵向排列

  selectStyle: object = {}; // 选择框的样式
  constructor() {}

  ngOnInit(): void {
    this.ctx.$scope.inverterSelectWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.getStateParams();
  }

  getStateParams() {
    this.allParams = [];
    // 遍历左边实体选择器
    this.ctx?.datasources.forEach((item) => {
      let params = {
        entityId: {
          id: item.entityId,
          entityType: item.entityType,
        },
        entityName: item.entityName,
        index: Number(item.entityName.substring(3)),
      };
      this.allParams.push(params);
    });
    this.allParams.sort(function (a, b) {
      return a.index - b.index;
    });
    // 遍历右边的显示数据
    this.ctx?.data.forEach((item) => {
      let hasKeys = this.rightDetailObj[item.datasource.name] ?? false;
      if (hasKeys) {
        this.rightDetailObj[item.datasource.name][item.dataKey.name] = {
          name: item.dataKey.label,
          val: item.data?.[0]?.[1],
          unit: item.dataKey?.units,
        };
      } else {
        this.rightDetailObj[item.datasource.name] = {};
        this.rightDetailObj[item.datasource.name][item.dataKey.name] = {
          name: item.dataKey.label,
          val: item.data?.[0]?.[1],
          unit: item.dataKey?.units,
        };
      }
    });
    this.currentState = this.ctx?.stateController?.getStateParams();

    if (JSON.stringify(this.currentState) === "{}") {
      this.currentParams = this.allParams[0].entityName;
    } else {
      this.currentParams = this.currentState.entityName;
    }
    // console.log('this.currentParams :>> ', this.currentParams, this.currentState,this.rightDetailObj);
    // this.rightCurrentData = [...Object.values(this.rightDetailObj[this.currentParams])]
    this.rightCurrentData = Object.values(
      this.rightDetailObj[this.currentParams]
    );
    // 配置项
    // this.currentStateName = isDefined(this.widgetConfig.settings.currentStateName) ? this.widgetConfig.settings.currentStateName : "default"
    this.isShowDetail = isDefined(this.widgetConfig.settings.isShowDetail)
      ? this.widgetConfig.settings.isShowDetail
      : true;
    this.customStyle = isDefined(this.widgetConfig.settings.customStyle)
      ? this.widgetConfig.settings.customStyle
      : "";
    this.isColumnBox = isDefined(this.widgetConfig.settings.isColumnBox)
      ? this.widgetConfig.settings.isColumnBox
      : false;

    // try {
    //   this.selectStyle = JSON.parse(this.widgetConfig.settings.selectStyle)
    // } catch (error) {
    //   this.selectStyle = {}
    //   console.error(error)
    // }
  }

  changeState() {
    // 根据select选中的实体名称和参数 更新仪表板状态，默认状态为default
    const params = this.allParams.filter(
      (item) => item.entityName === this.currentParams
    );
    this.ctx.stateController.updateState(
      this.ctx.stateController.getStateId(),
      params?.[0],
      false
    );
    LocalChche.setCache("windTurbine", this.currentParams);
    this.onDataUpdated();
  }

  /**
   * @param _ 索引index
   * @param windTurbine 遍历对象
   * @returns 返回判断唯一标识符
   */
  trackByLabel(_: number, windTurbine: unknown) {
    return (windTurbine as any).name;
  }
  onDataUpdated() {
    this.getStateParams();
    this.ctx.detectChanges();
  }

  ngOnDestroy(): void {
    LocalChche.deleteCache("windTurbine");
  }
}
