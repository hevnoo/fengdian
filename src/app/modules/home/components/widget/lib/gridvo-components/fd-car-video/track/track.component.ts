import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { GridvoUtilsService } from "@core/services/gridvo-utils.service";
import { CarVideoService, IStaff } from "../../common/services/car-video.service";
export enum TrackType {
  car,
  person
}
@Component({
  selector: 'tb-track',
  templateUrl: './track.component.html',
  styleUrls: ['../common.scss', './track.component.scss'],
})
export class TrackComponent implements OnInit {
  @Input() staffList: IStaff[];
  @Input() carList: any[];
  @Output() getTrack = new EventEmitter();
  validatePersonForm: FormGroup;
  validateCarForm: FormGroup;

  PersonTrack = [];
  CarTrack = [];

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private utils: GridvoUtilsService,
    private CarVideoService: CarVideoService) { }

  ngOnInit(): void {
    this.validatePersonForm = this.fb.group({
      person: [null],
      timeOfPerson: [null]
    });
    this.validateCarForm = this.fb.group({
      car: [null],
      timeOfCar: [null]
    });
  }

  /**
   * @description: 日期处理
   * @param {*}
   * @return {*}
   */
  timeDefaultValue = setHours(new Date(), 0);
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  // 获取人的轨迹
  selectChange(event, role) {
    if(typeof(event) === 'undefined') {
      if(role === 'staff') {
        this.message.info('该人员暂未绑定工卡')
      } else {
        this.message.info('该车辆暂未绑定位器')
      }
    }
  }
  getPersonTrack(value) {
    if(typeof(value.person) === 'undefined') {
      return this.message.info('该人员暂未绑定工卡')
    };
    if (this.utils.isNull(value.person) || this.utils.isNull(value.timeOfPerson)) {
      this.message.info('请将人员信息填写完整后查询');
      return;
    }
    const info = {
      id: value.person,
      type: TrackType.person,
      startTime: new Date(value.timeOfPerson[0]).getTime(),
      endTime: new Date(value.timeOfPerson[1]).getTime()
    }
    let go = true;
    if (this.PersonTrack.length > 0) {
      this.PersonTrack.forEach(item => {
        if (item.id === info.id &&
          item.startTime === info.startTime &&
          item.endTime === info.endTime
        ) {
          this.message.info('请选择不同的人员或者不同的时间');
          go = false;
        }
      })
    }
    if (!go) return;
    this.getTrack.emit(info);
    this.PersonTrack.push(info);
  }
  // 获取车的轨迹
  getCarTrack(value) {
    if(typeof(value.car) === 'undefined') {
      return this.message.info('该车辆暂未绑定位器')
    };
    if (this.utils.isNull(value.car) || this.utils.isNull(value.timeOfCar)) {
      this.message.info('请将车辆信息填写完整后查询');
      return;
    };
    const info = {
      id: value.car,
      type: TrackType.car,
      startTime: new Date(value.timeOfCar[0]).getTime(),
      endTime: new Date(value.timeOfCar[1]).getTime()
    }
    let go = true;
    if (this.CarTrack.length > 0) {
      this.CarTrack.forEach(item => {
        if (item.id === info.id &&
          item.startTime === info.startTime &&
          item.endTime === info.endTime
        ) {
          this.message.info('请选择不同的车辆或者不同的时间');
          go = false;
        }
      })
    }
    if (!go) return;
    this.getTrack.emit(info);
    this.CarTrack.push(info);
  }

}
