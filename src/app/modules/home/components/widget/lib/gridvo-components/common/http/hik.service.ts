/**
 * 在通常情况下，我们需要将与后端进行交互的行为封装成服务，在这个服务中完成对于获取到的数据的处理，
 * 之后再注入到需要使用该服务的组件中，从而确保组件中仅仅包含的是必要的业务逻辑行为。
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HikService {

  constructor(
    private http: HttpClient
  ) { }

  public getPresets(iChannelID: number): Observable<string> {
    return this.http.get(`/ISAPI/PTZCtrl/channels/${iChannelID}/presets`, { 'responseType': 'text' });
  }
}
