import { HttpClient } from "@angular/common/http";
import { defaultHttpOptionsFromConfig, RequestConfig } from "./http-utils";
import { Injectable } from "@angular/core";

export interface pageInfo {
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: "root",
})
export class WorkTickService {
  constructor(private http: HttpClient) {}

  // 分页查询
  public getPageInfo(page: pageInfo, config?: RequestConfig): any {
    return this.http.get(
      `/api/gv_main/wpms/work_ticket/paging?page=${page.page}&pageSize=${page.pageSize}`,
      defaultHttpOptionsFromConfig(config)
    );
  }
  public searchWork(
    page: pageInfo,
    cCode: string = "",
    SMaster: string = "",
    config?: RequestConfig
  ): any {
    let url = `/api/gv_main/wpms/work_ticket/paging?page=${page.page}&pageSize=${page.pageSize}`;
    if (cCode.length > 0) {
      url += `&cCode=${cCode}`;
    }
    if (SMaster.length > 0) {
      url += `&SMaster=${SMaster}`;
    }
    return this.http.get(url, defaultHttpOptionsFromConfig(config));
  }

  // 搜索数据
  public searchData(page: any, seaval: any, config?: RequestConfig): any {
    return this.http.get(`/api/gv_main/wpms/work_ticket/paging?${page}&${seaval}`, defaultHttpOptionsFromConfig(config))
  }
  
}
