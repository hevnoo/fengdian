import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TabsService } from "@app/core/services/tabs.service";
import { isDefined } from "@app/core/utils";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";

@Component({
    selector: 'tb-app-indexAnalysis-footer',
    templateUrl: './app-indexAnalysis-footer.component.html',
    styleUrls: ['./app-indexAnalysis-footer.component.scss']
})
export class FdAppIndexAnalysisFooterComponent implements OnInit {
    @Input() ctx: WidgetContext
    
    public barItem
    constructor(private tab: TabsService) {}

    ngOnInit(): void {
        this.initSetting()
    } 

    initSetting() {
        this.barItem = isDefined(this.ctx.widgetConfig.settings.changeItem) ? this.ctx.widgetConfig.settings.changeItem : []
        this.barItem?.forEach(item => {
            if (item?.name == '风场指标') {
                item.width = {width :'11%'}
            }else {
                item.width = {width: '50%'}
            }
            console.log(item, "底部");
            
        });
    }
    // 点击bar时，切换页面
    handleBar(item) {
        this.tab.handleClick(item)
    }
    
}