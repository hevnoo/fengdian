import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defaultHttpOptionsFromConfig, RequestConfig, defaultHttpUploadOptions } from './http-utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FailureAnalysisReportService {
  constructor(
    private http: HttpClient
  ) { }
  // 启动故障分析上报流程
  public faultStart(formData: any, config?: RequestConfig): any {
    return this.http.post(`/api/gv_flowable/fault/start`, formData, defaultHttpOptionsFromConfig(config))
  }

  // 故障分析报告审批 用这个接口
  public faultComplete(formData: any, config?: RequestConfig): any {
    return this.http.post(`/api/gv_flowable/fault/complete`, formData, defaultHttpOptionsFromConfig(config))
  }

  // 普通审批接口
  public taskComplete(formData: any, config?: RequestConfig): any {
    return this.http.post(`/api/gv_flowable/task/complete`, formData, defaultHttpOptionsFromConfig(config))
  }

  // 根据实例ID查询故障分析表单详情
  public getFaultInfo(processInstallId: string, config?: RequestConfig): any {
    return this.http.get(`/api/gv_flowable/fault/process_instance/${processInstallId}`, defaultHttpOptionsFromConfig(config))
  }

  //故障分析报告列表查询
  public getFaultList(params: any, config?: RequestConfig): any {
    return this.http.get(`/api/gv_flowable/fault?${params}`, defaultHttpOptionsFromConfig(config))
  }
}
