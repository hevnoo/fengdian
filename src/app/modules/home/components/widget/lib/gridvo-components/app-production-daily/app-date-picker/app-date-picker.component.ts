import { Component, Input, OnInit } from "@angular/core";
import { WidgetContext } from "@app/modules/home/models/widget-component.models";
import { differenceInCalendarDays } from "date-fns";
import { GfDayUtils } from "../../common/utils/day-utils-class";

@Component({
    selector: 'tb-app-date-picker',
    templateUrl: './app-date-picker.component.html',
    styleUrls: ['./app-date-picker.component.scss']
  })
export class FdAppDatePickerComponent implements OnInit {
    @Input() ctx: WidgetContext;

    public selectDate: Date;
    public isPanelShow: boolean;
    public disabledDate: any;
    ngOnInit(): void { 
        let disabledTime = +new Date()
        this.disabledDate = (current: Date): boolean => differenceInCalendarDays(current, disabledTime) >= 0
        let time = new Date(new Date().setDate(new Date().getDate() - 1))
        this.selectDate = time
        // console.log(time, "是否为昨天时间")
        this.onChange(time)
        
    }
    
    onChange(date: Date) {
        this.selectDate = date
        const [start, end] = [GfDayUtils.getBeginTodayAndEnd(0, date), GfDayUtils.getBeginTodayAndEnd(1, date)]
        this.ctx.timewindowFunctions.onUpdateTimewindow(start, end, 1000)
        console.log(date, '时间',this.ctx.timeWindow);
        this.isPanelShow = false
    }

    openPanel() {
        this.isPanelShow = true
    }
}
