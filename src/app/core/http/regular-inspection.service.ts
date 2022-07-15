import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { defaultHttpOptionsFromConfig, RequestConfig } from "./http-utils";

export interface pageInfo {
    page: number,
    pageSize: number
}

@Injectable({
    providedIn: 'root'
})
export class RegularInspectionService {
    constructor(private http: HttpClient) {}

    // 分页查询
    public getPageInfo( page: any, config?: RequestConfig ): any {
        return this.http.get(`/api/gv_main/device_inspection_plan/paging?${page}`, defaultHttpOptionsFromConfig(config))
    }

    // 查询某字段
    public getOtherData( params: any, config?: RequestConfig ): any {
        return this.http.get(`/api/gv_main/device_inspection_plan/query?${params}`, defaultHttpOptionsFromConfig(config))
    }

    // 新增
    public addNewData( data: any, config?: RequestConfig ): any {
        return this.http.post('/api/gv_main/device_inspection_plan/sync', data, defaultHttpOptionsFromConfig(config))
    }

    // 修改
    public changeData( data: any, config?: RequestConfig ): any {
        return this.http.put('/api/gv_main/device_inspection_plan/sync', data, defaultHttpOptionsFromConfig(config))
    }

    // 删除
    public delData( id: any, config?: RequestConfig): any {
        return this.http.delete(`/api/gv_main/device_inspection_plan/sync/${id}`, defaultHttpOptionsFromConfig(config))
        
    }

}