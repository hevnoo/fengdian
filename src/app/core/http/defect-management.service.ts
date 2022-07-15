import { Injectable } from "@angular/core";
import { defaultHttpOptionsFromConfig, RequestConfig } from "./http-utils";
import { HttpClient } from "@angular/common/http";
import { defectData } from "@shared/models/defect-management.model";

@Injectable({
  providedIn: "root",
})
export class DefectManagementService {
  constructor(private http: HttpClient) {}

  // 查询缺陷列表
  public getDefectList(params: any, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/defect?${params}`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 根据id获取缺陷详情
  public getDefectInfo(processInstallId: string, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/defect/process_instance/${processInstallId}`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 提交缺陷上报流程
  public defectStart(defectForm: defectData, config?: RequestConfig): any {
    return this.http.post(
      `/api/gv_flowable/defect/start`,
      defectForm,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 审批进度
  public getHistoricTask(id: string, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/process_instance/${id}/historic_task`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 流程实例图
  public getBpmnFile(processInstanceId: string, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/process_instance/${processInstanceId}/diagram`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 流程模型图
  public getRunTimeBpmnFile(key: string, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/process_defined/${key}/diagram`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 我的任务接口
  public getToDoWorkOrderList(params: any, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/query/work_order/to_do?${params}`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 工单查询
  public getHisWorkOrderList(params: any, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/query/work_order/his?${params}`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 我发起的
  public getMyOrderList(params: any, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_flowable/query/work_order/initiate?${params}`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  // 审批
  public taskComplete(formData: any, config?: RequestConfig): any {
    return this.http.post(
      `/api/gv_flowable/task/complete`,
      formData,
      defaultHttpOptionsFromConfig(config)
    );
  }
}
