import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { WidgetConfig } from '@shared/models/widget.models';
import { WidgetContext } from '@home/models/widget-component.models';
import { AttributeService } from '@core/http/attribute.service';
import { AttributeScope } from '@shared/models/telemetry/telemetry.models';
import { GridvoUtilsService } from "@core/services/gridvo-utils.service";
import { cloneDeep, isArray } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
interface IKeysArr {
  label: string;
  unit: string;
  dataKey: string;
  bindDataKey?: string;
  currentVal: number;
  isHandleData: string;
  handleDataFunction: any;
  [key: string]: string | number;
}
@Component({
  selector: 'tb-data-fraud',
  templateUrl: './data-fraud.component.html',
  styleUrls: ['./data-fraud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataFraudComponent implements OnInit {
  widgetConfig: WidgetConfig;
  @Input() ctx: WidgetContext;
  assetsId: string = undefined;
  title: string = undefined;
  isUse: boolean = false;
  saveData: IKeysArr[] = [];
  keysArr: IKeysArr[] = []; // 当没有存储数据时
  key: string = undefined;
  assetType: any = {
    entityType: 'ASSET',
    id: undefined
  };
  TMData: any;
  TMData$ = new Subject<any>();


  constructor(private attributeService: AttributeService,
    private utils: GridvoUtilsService,
    private message: NzMessageService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ctx.$scope.dataFraudWidget = this;
    this.widgetConfig = this.ctx.widgetConfig;
    this.initWidgetConfig();
    const subjection = this.TMData$.asObservable().subscribe(res => {
      this.TMData = res;
      if (typeof (this.assetType.id) === 'undefined') {
        subjection.unsubscribe();
        return;
      }
      this.attributeService.getEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE).subscribe(
        (serverScope) => {
          if (serverScope.length > 0) {
            const data = serverScope.filter(item => item.key === this.key)[0];
            if (typeof (data) === 'undefined') {
              this.bindValue(true);
            } else {
              this.isUse = data.value.isUse;
              this.saveData = data.value.dataFrauds;
              this.bindValue(false);
            };
            subjection.unsubscribe();
          }
        }
      )
    })
  }
  private initWidgetConfig() {
    this.assetType.id = this.widgetConfig.settings.assetsId;
    this.key = this.widgetConfig.settings.assetsKey;
    this.title = this.widgetConfig.settings.title;
    this.keysArr = this.widgetConfig.settings.keysArr;
  }

  onDataUpdated() {
    let TMData;
    const data = this.utils.handleTelemetryDataByAliasName(this.ctx.data);
    if (isArray(data)) {
      TMData = data;
    } else {
      TMData = Object.values(data).flat();
    };
    console.log('TMData :>> ', TMData);
    this.TMData$.next(TMData);
  }

  bindValue(firstInit) {
    let newData;
    if(firstInit) {
      newData = this.keysArr.map(item => {
        return this.handData(item, true);
      });
    } else {
      newData = this.keysArr.map(item => {
        const s = this.saveData.filter(s => s.dataKey == item.dataKey);
        if(s.length > 0) {
          item = s[0];
          return this.handData(item, false);
        }
      })
    }
    this.keysArr = newData;
    this.ref.detectChanges();
    this.ref.markForCheck();
  }

  handData(item, flag) {
    let currentVal;
    if (typeof (item.isHandleData) !== 'undefined' && item.isHandleData) { // 需要数据处理
      if (item.bindDataKey !== '') {
        const functionBody = item.handleDataFunction;
        if (typeof functionBody === 'undefined' || !functionBody.length) {
          this.message.error('需要数据处理函数');
        }
        let handleFunction = null;
        try {
          handleFunction = new Function('telemetry', 'bindDataKey', 'ctx', functionBody);
        } catch (e) {
          handleFunction = null;
        }
        currentVal = handleFunction(this.TMData, item.bindDataKey, this.ctx);
      } else {
        this.message.error('需要数据处理的请绑定数据key');
        item.bindDataKey = '';
        currentVal = 0;
      }
    } else { // 不需要数据处理
      // 绑定当前值
      if (item.bindDataKey !== '') {
        const tmd = this.TMData?.filter(tmd => Object.keys(tmd).includes(item.bindDataKey));
        if (tmd.length > 0) {
          currentVal = tmd[0][item.bindDataKey];
        }
      } else {
        item.bindDataKey = '';
        currentVal = 0;
      };
    }
    // 生成偏差值key
    if (flag) item[item.dataKey] = '';
    item.currentVal = currentVal;
    return item;
  }

  handleSave() {
    this.keysArr.forEach(item => {
      // @ts-ignore
      item[item.dataKey] = parseFloat(item[item.dataKey]);
    })
    const payload = [{
      key: this.key,
      value: {
        isUse: this.isUse,
        dataFrauds: this.keysArr
      }
    }];
    console.log('payload :>> ', payload);
    this.attributeService.saveEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE, payload).subscribe(
      () => {
        this.message.success(`保存成功!`);
      }
    )
  }
}
