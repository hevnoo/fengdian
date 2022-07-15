import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { defaultHttpOptions, RequestConfig } from "@core/http/http-utils";
import { IScheduleData } from "@gwhome/fd-schedule-manage/type";
import { dateFormat } from "@gwhome/common/utils/day-utils-func";

@Injectable({
  providedIn: "root",
})
export class ScheduleManageService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param page 页数从0开始
   * @param pageSize 每页大小
   */
  getPaging(page: number, pageSize: number) {
    // ​/gv_main​/arrange/paging
    // 分页查询
    return this.http.get(
      `/api/gv_main/arrange/paging?page=${page}&pageSize=${pageSize}`,
      defaultHttpOptions()
    );
  }

  patchScheduleData(schedule: IScheduleData) {
    if (schedule.networkId) {
      return this.http.put(
        "/api/gv_main/arrange/update",
        {
          dutyName: schedule.name,
          dutyTime: schedule.workTime,
          phone: schedule.phone,
          workType: schedule.workShfit,
          id: schedule.networkId,
        },
        defaultHttpOptions()
      );
    } else {
      return this.http.post(
        "/api/gv_main/arrange/add",
        {
          dutyName: schedule.name,
          dutyTime: schedule.workTime,
          phone: schedule.phone,
          workType: schedule.workShfit,
        },
        defaultHttpOptions()
      );
    }
  }

  deleteAnnoucement(schedule: IScheduleData) {
    return this.http.delete(
      `/api/gv_main/arrange/delete/${schedule.networkId}`
    );
  }

  /**
   * @param type 类型
   * @returns 1白班、2晚班
   */
  getType(type: string) {
    switch (type) {
      case "dayShift":
        return "1";
      default:
        return "2";
    }
  }

  getTypeValue(type: string | number) {
    switch (type) {
      case "白班":
        return "dayShift";
      default:
        return "nightShift";
    }
  }
  /**
   * @param dictionary typeid值
   * @returns 类型
   */
  getReverseType(dictionary: number) {
    switch (dictionary) {
      case 1:
        return "白班";
      default:
        return "晚班";
    }
  }

  mapIScheduleData(data: any) {
    return data.map((item, index) => {
      const result: IScheduleData = {
        isCheck: false,
        id: index + 1,
        name: item.dutyName,
        phone: item.phone,
        workShfit: this.getReverseType(item.workType),
        workTime: dateFormat(new Date(item.dutyTime), "yyyy-MM-dd hh:mm:ss"),
        disabled: false,
        networkId: item.id,
      };
      return result;
    }) as IScheduleData[];
  }

  assignPreIScheduleData(id: number): IScheduleData {
    return {
      isCheck: false,
      id: id,
      name: "",
      phone: "",
      workShfit: "",
      workTime: "",
      disabled: false,
    };
  }

  /**从小到大排序 */
  bubbleSort(data: { dutyTime: number }[], traling = true): any {
    const _data = Array.from(data);
    if (traling) {
      for (let i = 0; i < _data.length; i++) {
        for (let j = 0; j < _data.length - i - 1; j++) {
          if (_data[j].dutyTime > _data[j + 1].dutyTime) {
            let pre = _data[j + 1];
            _data[j + 1] = _data[j];
            _data[j] = pre;
          }
        }
      }
    } else {
      for (let i = 0; i < _data.length; i++) {
        for (let j = 0; j < _data.length - i - 1; j++) {
          if (_data[j].dutyTime < _data[j + 1].dutyTime) {
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
