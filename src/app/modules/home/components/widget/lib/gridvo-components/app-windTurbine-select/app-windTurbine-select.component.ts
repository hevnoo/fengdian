import { Component, Input, OnInit } from "@angular/core";
import { StateParams } from "@app/core/api/widget-api.models";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { WidgetConfig } from "@app/shared/models/widget.models";
import chche from "@gwhome/common/utils";
const { LocalChche } = chche;
@Component({
  selector: 'tb-app-windTurbine-select',
  templateUrl: './app-windTurbine-select.component.html',
  styleUrls: ['./app-windTurbine-select.component.scss']
})
export class FdAppWindTurbineSelectComponent implements OnInit {

  @Input() ctx: WidgetContext
  widgetConfig: WidgetConfig = {};
  allParams: StateParams[]; //绑定的全部实体数据源
  selectParams: StateParams[]; // 存储输入选择的数据源
  currentParams: string; //当前选择器选中的实体状态的name名称（因为直接用对象会有更新问题）
  rightDetailObj: object = {}; //用于筛选右边显示的全部数据obj
  rightCurrentData: any[] = []; //当前需要显示的右边数据
  currentState: any = {}; //获取到的仪表板状态

  // 部件可配置选项
  // public currentStateName: string = "default"
  isShowDetail: boolean = true;
  customStyle: string = "";
  isColumnBox: boolean = false; //数值默认是横向排列  为true则纵向排列

  constructor() { }

  ngOnInit(): void {
    this.ctx.$scope.inverterSelectWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.getStateParams();
    this.selectParams = this.allParams
  }

  getStateParams() {
    this.allParams = [];
    // 遍历左边实体选择器
    // console.log(this.ctx.datasources, "风机名")
    this.ctx?.datasources.forEach((item) => {
      let params = {
        entityId: {
          id: item.entityId,
          entityType: item.entityType,
        },
        entityName: item.entityName,
        index: Number(item.entityName.substring(3))
      };
      this.allParams.push(params);

    });
    this.allParams.sort(function (a, b) {
      return a.index - b.index;
    });
    // 遍历右边的显示数据
    // console.log(this.ctx.data, "风机选择器");
    
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
      this.currentParams = this.allParams[0]?.entityName;
    } else {
      this.currentParams = this.currentState?.entityName;
    }

    this.rightCurrentData = Object.values( 
      this.rightDetailObj[this.currentParams]
    );   
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

  onDeviceSearch(e) {
    if (!e) {
      this.selectParams = this.allParams
      return
    }
    this.selectParams = this.allParams.filter(item => {
      if (item?.entityName.indexOf(e) !== -1) return true
    })

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