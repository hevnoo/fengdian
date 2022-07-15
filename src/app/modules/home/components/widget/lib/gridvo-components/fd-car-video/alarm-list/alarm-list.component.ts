import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EleFenceService } from "../../common/http/ele-fence.service";
import { CarVideoService } from "../../common/services/car-video.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import { EntityId } from '@shared/models/id/entity-id';
import { AlarmService } from '@core/http/alarm.service';
import { AlarmSeverity, AlarmStatus } from '@shared/models/alarm.models';
import { NzModalService } from 'ng-zorro-antd/modal';
interface IAlarmData {
  createdTime: number;
  details?: string;
  id: EntityId,
  name: string;
  originator: EntityId;
  originatorName: string;
  severity: AlarmSeverity;
  type: string;
  status: AlarmStatus;
}

@Component({
  selector: 'tb-alarm-list',
  templateUrl: './alarm-list.component.html',
  styleUrls: ['../common.scss']
})
export class AlarmListComponent implements OnInit, OnDestroy {

  modalVisiable: boolean = false;
  modalData = {
    createdTime: undefined,
    details: undefined,
    id: undefined,
    name: undefined,
    originator: undefined,
    originatorName: undefined,
    severity: undefined,
    type: undefined,
    status: undefined
  };

  tableData: IAlarmData[] = [];

  entityIds: string[] = [];
  timer: NodeJS.Timeout = null;
  userList: any[] = []; // 使用人和车的集合

  Searchvalue: string = "";
  listOfCurrentPageData: ReadonlyArray<IAlarmData> = [];

  severityMap = new Map<AlarmSeverity, string>(
    [
      [AlarmSeverity.CRITICAL, '一级'],
      [AlarmSeverity.MAJOR, '二级'],
      [AlarmSeverity.MINOR, '三级'],
      [AlarmSeverity.WARNING, '四级']
    ]
  );
  alarmStatusMap = new Map<AlarmStatus, string>(
    [
      [AlarmStatus.ACTIVE_UNACK, '激活未应答'],
      [AlarmStatus.ACTIVE_ACK, '激活已应答'],
      [AlarmStatus.CLEARED_UNACK, '清除未应答'],
      [AlarmStatus.CLEARED_ACK, '清除已应答'],
    ]
  );

  constructor(private EleFenceService: EleFenceService,
    private CarVideoService: CarVideoService,
    private modal: NzModalService,
    private message: NzMessageService,
    private ref: ChangeDetectorRef,
    private alarmService: AlarmService) { }

  ngOnInit(): void {
    // 懒加载 点到这个tab页才会执行
    // @ts-ignore
    this.userList = [...this.CarVideoService.carList, ...this.CarVideoService.staffList];
    const orientatorList = this.CarVideoService.orientatorList$.getValue();
    if (orientatorList.length > 0) {
      orientatorList.forEach(item => this.entityIds.push(item.entityId));
    };
    const workCardList = this.CarVideoService.workCardList$.getValue();
    if (workCardList.length > 0) {
      workCardList.forEach(item => this.entityIds.push(item.entityId));
    };

    this.loadData();
    this.timer = setInterval(() => {
      this.loadData();
    }, 3 * 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  loadData() {
    if (this.entityIds.length <= 0) return;
    let payload = {
      entityIds: this.entityIds,
      searchStatus: 'ACTIVE',
      textSearch: this.Searchvalue,
      pageSize: 30,
      page: 0
    }
    this.EleFenceService.getAlarmData(payload).subscribe(res => {
      console.log('每隔3秒轮询是否有告警 :>> ', res);
      // console.log('userList :>> ', this.userList);
      if (res.data.length <= 0) {
        this.tableData = [];
      } else {
        // filter过滤已经应答确认的
        this.tableData = res.data.filter(item => item.ackTs === 0).map(item => {
          let useName;
          this.userList.forEach(user => {
            if (typeof (user.workCardEntityId) !== 'undefined') {
              useName = user.name;
            } else if (typeof (user.orientatorId) !== 'undefined') {
              useName = user.name;
            }
          })
          return {
            createdTime: item.createdTime,
            details: item.details,
            id: item.id,
            name: item.name,
            originator: item.originator,
            originatorName: useName,
            severity: item.severity,
            type: item.type,
            status: item.status
          }
        });
      }
      this.ref.detectChanges();
    })
  }
  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<IAlarmData>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  //  点击按钮
  onItemChecked(row: IAlarmData): void {
    this.modalData.createdTime = new Date(row.createdTime);
    this.modalData.details = row.details;
    this.modalData.id = row.id;
    this.modalData.name = row.name;
    this.modalData.originator = row.originator;
    this.modalData.originatorName = row.originatorName;
    this.modalData.severity = this.severityMap.get(row.severity);
    this.modalData.type = row.type;
    this.modalData.status = this.alarmStatusMap.get(row.status);
    this.modalVisiable = true;
  }

  handleClear() {
    this.alarmService.clearAlarm(this.modalData.id.id).subscribe(() => {
      this.loadData();
      this.modalVisiable = false;
      this.message.success('清除成功')
    });
  }
  handleOk() {
    this.modal.confirm({
      nzTitle: '<i>告警确认</i>',
      nzContent: '确定要确认告警吗?',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.alarmService.ackAlarm(this.modalData.id.id).subscribe(() => {
          this.loadData();
          this.modalVisiable = false;
          this.message.success('确认成功')
        });
      }
    });

  }
}
