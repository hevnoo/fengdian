import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defaultHttpOptionsFromConfig, RequestConfig } from '@core/http/http-utils';
import { Observable } from 'rxjs';
import { GridvoUtilsService } from '@app/core/services/gridvo-utils.service';
import { EntityId } from '@shared/models/id/entity-id';
import { EntityType } from '@shared/models/entity-type.models';

@Injectable({
    providedIn: 'root'
})
export class EleFenceService {
    constructor(
        private http: HttpClient,
        private utils: GridvoUtilsService
    ) {}

    // 获取围栏列表
    public getFenceList(pageSize, page, config?: RequestConfig): Observable<any> {
        const url = `/api/enclosure/paging?pageSize=${pageSize}&page=${page}`;
        return this.http.get(url, defaultHttpOptionsFromConfig(config));
    }

    // 新增或更新电子围栏信息
    public addOrModifyFence(methods, formData, config?: RequestConfig): Observable<any> {
        const url = `/api/enclosure/sync`;
        if (methods === 'POST') {
            return this.http.post(url, formData, defaultHttpOptionsFromConfig(config));
        } else {
            return this.http.put(url, formData, defaultHttpOptionsFromConfig(config));
        }
    }

    // 删除
    public deleteFenceById(id, config?: RequestConfig): Observable<any> {
        const url = `/api/enclosure/sync/${id}`;
        return this.http.delete(url, defaultHttpOptionsFromConfig(config));
    }

    // 轨迹回放
    public getTrack(EntityId: EntityId, payload, config?: RequestConfig): Observable<any> {
        let url = `/api/plugins/telemetry/${EntityId.entityType}/${EntityId.id}/values/timeseries`;
        url += `?keys=${payload.keys}`;
        url += `&startTs=${payload.startTs}`;
        url += `&endTs=${payload.endTs}`;
        return this.http.get(url, defaultHttpOptionsFromConfig(config));
    }

    // 获取告警信息
    public getAlarmData(payload, config?: RequestConfig): Observable<any> {
        let url = `/api/${EntityType.DEVICE}/alarms`;
        return this.http.post(url, payload, defaultHttpOptionsFromConfig(config));
    }
    
    // rpc
    public sendInstruction(deviceId, payload, config?: RequestConfig): Observable<any> {
        let url = `/api/plugins/rpc/oneway/${deviceId}`;
        return this.http.post(url, payload, defaultHttpOptionsFromConfig(config));
    }
}
