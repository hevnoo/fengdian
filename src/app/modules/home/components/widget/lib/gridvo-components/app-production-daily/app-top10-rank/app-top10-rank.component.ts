import { Component, Input, OnInit } from "@angular/core";
import { isDefined } from "@app/core/utils";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";

@Component({
    selector: 'tb-app-top10-rank',
    templateUrl: './app-top10-rank.component.html',
    styleUrls: ['./app-top10-rank.component.scss']
})
export class FdAppTop10RankComponent implements OnInit {
    @Input() ctx: WidgetContext;

    public showTopData: any[] = [];  // 存储要循环的数组
    public topData: any[];   // 获取到的前几的数据
    public showNumber: number  // 要进行前几的排名值
    public title: string  // 标题

    ngOnInit(): void {
        this.ctx.$scope.topRank = this
        this.initSetting()
        this.initData()
    }

    initSetting() {
        const settings = this.ctx.widgetConfig.settings
        this.title = isDefined(settings.title) ? settings.title : '请设置部件标题'
        this.showNumber = isDefined(settings.rankNum) ? settings.rankNum : 10
    }

    initData() {
        let dataArr = this.ctx.data.filter((item) => {
            if (item?.data?.length > 0) {
                return true
            }
        })
        let arr = dataArr.length > 0 ? dataArr : this.ctx.data
        this.topData = arr.sort((a,b) => {
            return b?.data?.[b.data.length - 1]?.[1] - a?.data?.[a.data.length - 1]?.[1]
        }).slice(0, Math.floor(this.showNumber))
    }

    // 将排名的数据进行设置
    initWidth() {
        let that = this
        that.showTopData = []
        let top1Value = that.topData[0]?.data?.[that.topData[0]?.data?.length - 1]?.[1]
        that.topData.forEach((item, index) => {
            let oneItem = {
                name: item.datasource.name,
                width: that.handleWidth(item, index, top1Value),
                val: (item.data?.[item.data.length - 1]?.[1] / 10000).toFixed(2)
            }
            that.showTopData.push(oneItem)
        })
    }

    // 根据值和排名第一的值得比例返回宽度值
    handleWidth(item, rank, top1Value) {
        if (rank === 0) {
            return '100%'
        }
        let rankValue = item.data?.[item.data.length - 1]?.[1]
        let progress = ((rankValue / top1Value) * 100).toFixed(2) + '%'
        return progress
    }

    public onDataUpdate() {
        this.initData()
        this.initWidth()
        this.ctx.detectChanges()
    }
}