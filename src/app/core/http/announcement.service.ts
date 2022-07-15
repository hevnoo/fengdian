import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { defaultHttpOptions, defaultHttpOptionsFromConfig, RequestConfig } from "@core/http/http-utils";
import { IAnnouncement } from "@gwhome/fd-announcement-manage/type";
import { dateFormat } from "@gwhome/common/utils/day-utils-func";
@Injectable({
  providedIn: "root",
})
export class AnnouncementService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param page 页数从0开始
   * @param pageSize 每页大小
   */
  getPaging(page: number, pageSize: number) {
    // ​/gv_main​/notice​/paging
    // 分页查询
    return this.http.get(
      `/api/gv_main/notice/paging?page=${page}&pageSize=${pageSize}`,
      defaultHttpOptions()
    );
  }

  // 搜索数据
  searchData(page: any, data: any, config?: RequestConfig ) :any {
    return this.http.get(`/api/gv_main/notice/paging?${page}&${data}`, defaultHttpOptionsFromConfig(config))
  }

  patchAnnoucement(anno: IAnnouncement) {
    if (anno.networkId) {
      return this.http.put(
        "/api/gv_main/notice/sync",
        {
          content: anno.content,
          dictionary: anno.type,
          fileUrl: anno.enclosure ?? "",
          topic: anno.theme,
          id: anno.networkId,
        },
        defaultHttpOptions()
      );
    } else {
      console.log("无id");
      return this.http.post(
        "/api/gv_main/notice/sync",
        {
          content: anno.content,
          dictionary: anno.type,
          fileUrl: anno.enclosure,
          topic: anno.theme,
        },
        defaultHttpOptions()
      );
    }
  }

  deleteAnnoucement(anno: IAnnouncement) {
    return this.http.delete(`/api/gv_main/notice/sync/${anno.networkId}`);
  }

  /**
   * @param type 类型
   * @returns 1公告、2通知、3通报
   */
  getType(type: string) {
    switch (type) {
      case "announcement":
        return "1";
      case "notice":
        return "2";
      default:
        return "3";
    }
  }

  getTypeValue(type: string | number) {
    switch (type) {
      case "公告":
        return "announcement";
      case "通知":
        return "notice";
      default:
        return "bulletin";
    }
  }
  /**
   * @param dictionary typeid值
   * @returns 类型
   */
  getReverseType(dictionary: number) {
    switch (dictionary) {
      case 1:
        return "公告";
      case 2:
        return "通知";
      default:
        return "通报";
    }
  }

  mapIAnnouncement(data: any) {
    return data.map((item, index) => {
      const resultObj: IAnnouncement = {
        isCheck: false,
        id: index + 1,
        theme: item.topic,
        type: this.getReverseType(item.dictionary as number),
        content: item.content,
        enclosure: item.fileUrl?.split("/").slice(-1)[0],
        creater: "admin",
        date: dateFormat(new Date(item.createTime), "yy-MM-dd hh:mm:ss"),
        disabled: false,
        networkId: item.id,
        createrId: item.creatorId,
        completeEnclosure: item.fileUrl,
      };
      return resultObj;
    }) as IAnnouncement[];
  }

  assignPreIAnnouncement(id: number): IAnnouncement {
    return {
      isCheck: false,
      id: id,
      theme: "",
      type: 0,
      content: "",
      enclosure: "",
      creater: "admin",
      date: dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"),
      disabled: false,
    };
  }

  /**从小到大排序 */
  bubbleSort(data: { createTime: number }[], traling = true): any {
    const _data = Array.from(data);
    if (traling) {
      for (let i = 0; i < _data.length; i++) {
        for (let j = 0; j < _data.length - i - 1; j++) {
          if (_data[j].createTime > _data[j + 1].createTime) {
            let pre = _data[j + 1];
            _data[j + 1] = _data[j];
            _data[j] = pre;
          }
        }
      }
    } else {
      for (let i = 0; i < _data.length; i++) {
        for (let j = 0; j < _data.length - i - 1; j++) {
          if (_data[j].createTime < _data[j + 1].createTime) {
            let pre = _data[j + 1];
            _data[j + 1] = _data[j];
            _data[j] = pre;
          }
        }
      }
    }

    return _data;
  }
}
