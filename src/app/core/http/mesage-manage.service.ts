import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defaultHttpOptionsFromConfig, RequestConfig, defaultHttpUploadOptions } from './http-utils';
import { Observable } from 'rxjs';
export interface pageInfo {
    page: number,
    pageSize: number
}
@Injectable({
    providedIn: 'root'
})
export class MessageManageService {
    constructor(
        private http: HttpClient
    ) { }
    // 我发送的
    public mySend(page: pageInfo, config?: RequestConfig): any {
        return this.http.get(`/api/gv_main/sms/paging?page=${page.page}&pageSize=${page.pageSize}`, defaultHttpOptionsFromConfig(config))
    }
    // 我接收的
    public myReceived(page: pageInfo, config?: RequestConfig): any {
        return this.http.get(`/api/gv_main/sms/paging/toMe?page=${page.page}&pageSize=${page.pageSize}`, defaultHttpOptionsFromConfig(config))
    }
    // 我发送的详情
    public mySendDetail(id: string, config?: RequestConfig) {
        return this.http.get('/api/gv_main/sms/query/fromMe/' + id, defaultHttpOptionsFromConfig(config))
    }
    // 我接收的详情
    public myReceivedDetail(id: string, config?: RequestConfig) {
        return this.http.get('/api/gv_main/sms/query/toMe/' + id, defaultHttpOptionsFromConfig(config))
    }
    // 发送短信
    public sendMessage(params, config?: RequestConfig) {
        return this.http.post('/api/gv_main/sms/send', params, defaultHttpOptionsFromConfig(config))
    }
    //删除发送的
    public deleteSend(id: string, config?: RequestConfig) {
        return this.http.delete('/api/gv_main/sms/sync/fromMe/' + id, defaultHttpOptionsFromConfig(config))
    }
    // 删除接收的
    public deleteReviced(id: string, config?: RequestConfig) {
        return this.http.delete('/api/gv_main/sms/sync/toMe/' + id, defaultHttpOptionsFromConfig(config))
    }
    // 获取电话号码
    public getPhone(id: string, config?: RequestConfig) {
        return this.http.get('/api/gv_main/sms/phone/' + id, defaultHttpOptionsFromConfig(config))
    }
    // 根据短信内容搜索（我发送的）
    public searchSend(page: any, data: any,  config?: RequestConfig) {
        return this.http.get(`/api/gv_main/sms/paging?${page}&${data}`, defaultHttpOptionsFromConfig(config))
    }
    // 根据短信内容搜索（我接收的）
    public searchRec(page: any, data: any,  config?: RequestConfig) {
        return this.http.get(`/api/gv_main/sms/paging/toMe?${page}&${data}`, defaultHttpOptionsFromConfig(config))
    }
}
