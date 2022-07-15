import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  defaultHttpOptionsFromConfig,
  RequestConfig,
  defaultHttpUploadOptions,
} from "./http-utils";
import { Observable } from "rxjs";
import { GridvoUtilsService } from "@app/core/services/gridvo-utils.service";

@Injectable({
  providedIn: "root",
})
export class FileManagementService {
  constructor(private http: HttpClient, private utils: GridvoUtilsService) { }

  // 文件列表查询
  public getFilesList(
    fetchValue?: { [key: string]: any },
    config?: RequestConfig
  ): Observable<any> {
    const valueString = fetchValue
      ? this.utils.object2GetFetchValue(fetchValue)
      : "";
    const url = `/api/gv_main/dfs/group1/list_dir` + valueString;
    return this.http.get(url, defaultHttpOptionsFromConfig(config));
  }

  // 文件查询
  public searchFiles(
    fetchValue?: { [key: string]: any },
    config?: RequestConfig
  ): Observable<any> {
    let url = `/api/gv_main/dfs/group1/search`
    if (fetchValue && Object.keys(fetchValue).length) {
      url += this.utils.object2GetFetchValue(fetchValue)
    }
    return this.http.get(url, defaultHttpOptionsFromConfig(config));
  }

  // 文件上传
  public fileUpload(formData, config?: RequestConfig): Observable<any> {
    const _config = config
      ? defaultHttpUploadOptions(
        config.ignoreErrors,
        config.ignoreLoading,
        config.resendRequest
      )
      : {};
    return this.http.post("/group1/upload", formData, _config);
  }

  // 文件详情
  public getFilesInfo(
    fetchValue: { md5: string; path: string },
    config?: RequestConfig
  ): Observable<any> {
    const valueString = fetchValue
      ? this.utils.object2GetFetchValue(fetchValue)
      : "";
    const url = `/api/gv_main/dfs/group1/get_file_info` + valueString;
    return this.http.get(url, defaultHttpOptionsFromConfig(config));
  }

  // 删除文件
  public deleteFile(
    fetchValue: { md5: string; path?: string },
    config?: RequestConfig
  ): Observable<any> {
    const valueString = fetchValue
      ? this.utils.object2GetFetchValue(fetchValue)
      : "";
    const url = `/api/gv_main/dfs/group1/delete` + valueString;
    return this.http.delete(url, defaultHttpOptionsFromConfig(config));
  }

  // 删除目录
  public deleteDir(fetchValue: { [key: string]: any }, config?: RequestConfig): Observable<any> {
    const valueString = this.utils.object2GetFetchValue(fetchValue)
    const url = `/api/gv_main/dfs/group1/delete_dir` + valueString
    return this.http.delete(url, defaultHttpOptionsFromConfig(config))
  }
}
