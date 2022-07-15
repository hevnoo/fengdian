
import { Component, Input, OnInit } from "@angular/core";
import { GridvoMobileService, isDefined } from "@app/core/public-api";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
// 该声明用于测试，之后需删除
// declare const window: Window & { GridvoChatApp: any  }

@Component({
    selector: 'tb-app-remote-assistance',
    templateUrl: './app-remote-assistance.component.html',
    styleUrls: ['./app-remote-assistance.component.scss']
})

export class FdAppRemoteAssistanceComponent implements OnInit {
    @Input() ctx: WidgetContext
    
    constructor(private gridvoMobileService: GridvoMobileService) {}
   
    public dataArr: any
    public dataList = [
        {
            label: '风场值班',
            id: 'watcher',
            svgIcon: 'zhiban.svg'
        },
        {
            label: '集控中心',
            id: 'controler',
            svgIcon: 'jikongtai.svg'
        },
        {
            label: '后台专家',
            id: 'expert',
            svgIcon: 'zhuangjia.svg'
        }
    ]

    ngOnInit(): void {
        this.initSetting()
    }

    initSetting() {
        const settings = this.ctx.widgetConfig.settings
        this.dataArr = isDefined(settings.dataItem) ? settings.dataItem : []
    }

    // 点击某项进行的对应操作
    handle(id, i) {
        const optainer = this.gridvoMobileService.videoCallByUser(this.dataArr?.[i]['host'], this.dataArr?.[i]['user'])
        switch (id) {
            case 'watcher':
                optainer
                break;
            case 'controler':
                optainer
                break;
            case 'expert':
                optainer
                break;
            default:
                break;
        } 
        
    }
  
}