import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AssetService } from "@core/http/asset.service";
import { AttributeService } from "@core/http/attribute.service";
import { AttributeScope } from "@shared/models/telemetry/telemetry.models";
import type { EntityId } from "@shared/models/id/entity-id";
import { EntityType } from "@shared/models/entity-type.models";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { TabsService } from "@core/services/tabs.service";
/**
 * @description: 首页常用链接
 * @param {*}
 * @return {*}
 */
@Component({
  selector: 'tb-frequently-links',
  templateUrl: './frequently-links.component.html',
  styleUrls: ['./frequently-links.component.scss']
})
export class FrequentlyLinksComponent implements OnInit {
  popoverOverlayStyle = {
    width: '270px',
  };
  /* 操作ThingsBoard的数据，存储类型（这里是资产类型）和Id号*/
  assetType: EntityId = {
    entityType: EntityType.ASSET,
    id: null,
  };
  tableData;
  constructor(
    protected store: Store<AppState>, private router: Router,
    private assetService: AssetService,
    private attributeService: AttributeService,
    private TabsService: TabsService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.requestLinks("link-manage");
  }
  /**
   * 用于请求ThingsBoard中之前部署好的资产类型数据。
   * @param name 资产类型名称
   */
   requestLinks(name: string = "link-manage") {
    this.assetService.findByName(name).subscribe((result) => {
      this.assetType.id = result.id.id;
      this.attributeService.getEntityAttributes(this.assetType, AttributeScope.SERVER_SCOPE).subscribe((result2) => {
        if (result2.length > 0) {
          const filterData = result2.filter(item => item.key === 'links');
          if(filterData.length > 0) {
            this.tableData = filterData[0].value;
          }
          this.cd.markForCheck();
          this.cd.detectChanges();
        }
      });
    });
  }

  handleTo(event) {
    window.open(`${event.link}`);
  }

}
