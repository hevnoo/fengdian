import { Injectable } from '@angular/core';
import moment from 'moment';
import { isMobile } from "@core/utils";
import { DefectManagementService } from '../http/defect-management.service';

interface TimeReturnObj {
    startTime: number,
    endTime: number
}
interface ITData {
    entityId: string;
    color: string;
    [key: string]: string | number;
}
interface ITelemetryData {
    [key: string]: ITData[];
}
@Injectable({
    providedIn: 'root'
})
export class GridvoUtilsService {
    constructor(private defectManagementService: DefectManagementService) { }
    // get请求时使用，将对象转换成string
    public object2GetFetchValue(obj: { [key: string]: any } | undefined): string {
        if (!obj) {
            return ""
        }
        let str = ""
        Object.entries(obj).forEach(([key, value], index) => {
            str += index ? "&" : "?"
            str += `${key}=${value}`
        })
        return str
    }
    /**
    * @description 文件大小转换成string显示
    * @param size 类型是number，单位是B
    * @returns 返回一个字符串 100kb | 200MB ...
    */
    public transSize2String(size: number): string {
        if (!size) { return '0B' }
        if (size < 1024) { return `${size}B` }
        const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB"]
        for (let i = 0; i < units.length; i++) {
            const unitSize = 1024 ** (i + 1)
            const result = size / unitSize
            if (result < 1) {
                const lastUnitSize = 1024 ** i
                const lastResult = size / lastUnitSize
                return `${lastResult.toFixed(4)}${units[i - 1]}`
            }
            if (i === units.length - 1) {
                return `${result.toFixed(4)}${units[i]}`
            }
        }
    }

    /**
     * @description 获得年月日
     * @returns { y: number, m: number, d: number }
     */
    public getYMD(time?: moment.MomentInput): { y: number, m: number, d: number } {
        time = time || Date.now()
        return {
            y: moment(time).year(),
            m: moment(time).month(),
            d: moment(time).date()
        }
    }

    /**
     * @description 获得今天开始时间跟结束时间
     * @returns { startTime: number, endTime: number }
     */
    public getTodayStartEnd(time?: moment.MomentInput): TimeReturnObj {
        time = time || Date.now()
        const { y, m, d } = this.getYMD(time)
        const startTime = moment(`${y}-${m + 1}-${d} 00:00:00`).valueOf()
        const endTime = moment(`${y}-${m + 1}-${d} 23:59:59`).valueOf()
        return { startTime, endTime }
    }

    /**
     * @description 获得周的开始时间跟结束时间
     * @returns { startTime: number, endTime: number }
     */
    public getWeekStartEnd(time?: moment.MomentInput): TimeReturnObj {
        time = time || Date.now()
        const weekday = moment(time).weekday() // 0是星期天，1是星期一，...
        const weekFirstDay = moment(time).valueOf() - weekday * 24 * 60 * 60 * 1000
        const weekLastDay = moment(time).valueOf() + (6 - weekday) * 24 * 60 * 60 * 1000
        const { y: y1, m: m1, d: d1 } = this.getYMD(weekFirstDay)
        const { y: y2, m: m2, d: d2 } = this.getYMD(weekLastDay)
        const startTime = moment(`${y1}-${m1 + 1}-${d1} 00:00:00`).valueOf()
        const endTime = moment(`${y2}-${m2 + 1}-${d2} 23:59:59`).valueOf()
        return { startTime, endTime }
    }

    /**
     * @description 获得月的开始时间跟结束时间
     * @returns { startTime: number, endTime: number }
     */
    public getMonthStartEnd(time?: moment.MomentInput): TimeReturnObj {
        time = time || Date.now()
        const { y, m } = this.getYMD(time)
        const lastDate = this.getMonthLastDate(time)
        const startTime = moment(`${y}-${m + 1}-1 00:00:00`).valueOf()
        const endTime = moment(`${y}-${m + 1}-${lastDate} 23:59:59`).valueOf()
        return { startTime, endTime }
    }

    /**
     * @description 获得月的最后一天
     * @returns monthLastDay: number
     */
    public getMonthLastDate(time?: moment.MomentInput): number {
        time = time || Date.now()
        const { y, m } = this.getYMD(time)
        return new Date(y, m + 1, 0).getDate()
    }

    public isNull(e): boolean {
        return Object.prototype.toString.call(e) === '[object Null]';
    }
    public isEmptyObject(e): boolean {
        return 0 === Object.keys(e).length;
    }
    /**
     * @description: 检测是否是移动端并且 window下面有没有GridvoChatApp埋点
     * @param {*}
     * @return {*}
     */
    isGridvoChatApp(): boolean {
        return isMobile() && typeof ((window as any).GridvoChatApp) !== 'undefined';
    }

    /**
     * @description: 根据别名处理遥测数据、只有一条数据源的时候直接返回值
     * key: 为数据订阅的时候的dataKey.label，可以自定义label
     * data.name为订阅的key，不同的key，其name也不同，取label可以自定义
     * @param {*} telemetryData: this.ctx.data
     * @return {*} 对象：key为数据源的名称，value为不同设备的绑定key的值的数组
     */
    public handleTelemetryDataByAliasName(telemetryData = []): any {
        if (telemetryData.length <= 0) return;
        let result: ITelemetryData = {};
        telemetryData.forEach((item: any) => {
            let aliasName = item.datasource.aliasName;
            let entityId = item.datasource.entityId;
            let key = item.dataKey.label;
            let value = item.data[0] && item.data[0][1];
            let color = item.dataKey.color;
            if (typeof (result[aliasName]) === 'undefined') {
                result[aliasName] = [];
                result[aliasName].push({
                    [key]: value,
                    entityId: entityId,
                    color
                })
            } else {
                const ids = result[aliasName].findIndex(item => item.entityId === entityId);
                if (ids > -1) {
                    result[aliasName][ids][key] = value;
                } else {
                    result[aliasName].push({
                        [key]: value,
                        entityId: entityId,
                        color
                    })
                }
            }
        });
        if (Object.keys(result).length === 1) {
            return Object.values(result)[0];
        } else {
            return result;
        }
    }
}
