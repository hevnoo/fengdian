import { HttpClient } from "@angular/common/http";
import { defaultHttpOptionsFromConfig, RequestConfig } from './http-utils';
import { Injectable } from "@angular/core";

export interface pageInfo {
    page: number,
    pageSize: number
}

@Injectable({
    providedIn: 'root'
})


export class ResumeChromicleService {

    constructor(private http: HttpClient) {}

    // 分页查询
    public getPageInfo(page: any, config?: RequestConfig ) :any {
        return this.http.get(`/api/gv_main/device_experience/paging?${page}`, defaultHttpOptionsFromConfig(config))
    }

    // 搜索数据
    public searchData(page: any, keyword: any, config?: RequestConfig ) :any {
        return this.http.get(`/api/gv_main/device_experience/paging?${page}&${keyword}`, defaultHttpOptionsFromConfig(config))
    }

    // 新增记录
    public addChronicleData(chronicleData: any, config?: RequestConfig): any {
        return this.http.post('/api/gv_main/device_experience/sync', chronicleData, defaultHttpOptionsFromConfig(config))
    }

    // 删除记录
    public delChronicleData(id: string, config?: RequestConfig): any {
        return this.http.delete(`/api/gv_main/device_experience/sync/${id}`, defaultHttpOptionsFromConfig(config))
    }

    // 修改记录
    public changeChronicleData(newData: any, config?: RequestConfig): any {
        return this.http.put('/api/gv_main/device_experience/sync', newData, defaultHttpOptionsFromConfig(config))
    }

}