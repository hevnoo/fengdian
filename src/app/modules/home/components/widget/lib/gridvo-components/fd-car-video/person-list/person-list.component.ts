import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CarVideoService, IStaff } from "../../common/services/car-video.service";
import { cloneDeep } from "lodash";
import { NzMessageService } from 'ng-zorro-antd/message';
import { EleFenceService } from "../../common/http/ele-fence.service";
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tb-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['../common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListComponent implements OnInit {
  @Output() staffOfCheckedId = new EventEmitter();

  staffList: IStaff[];
  Searchvalue: string = "";
  checked = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: ReadonlyArray<IStaff> = [];

  popoverOverlayStyle = {
    width: '270px'
  };
  instructionList = [
    { text: "考勤成功", code: "04" },
    { text: "考勤失败", code: "05" },
    { text: "您已离开工作区域", code: "03" },
    { text: "读标签成功", code: "10" },
    { text: "读标签失败", code: "11" },
    { text: "SOS警报已解除", code: "19" },
    { text: "火警警报", code: "16" },
    { text: "找工卡铃声", code: "17" },
    { text: "进入巡检模式", code: "08" },
    { text: "巡检时间已到", code: "09" },
    { text: "上班时间已到", code: "0A" },
    { text: "开会时间已到", code: "0B" },
    { text: "您已偏离路线", code: "0C" },
    { text: "巡检成功(语音)", code: "07" },
    { text: "巡检成功(马达震动)", code: "06" },
    { text: "巡检失败", code: "12" },
    { text: "您已偏离活动区域", code: "0D" },
    { text: "GPS失败", code: "0F" },
    { text: "情况紧急，请马上离开", code: "01" },
    { text: "您已进入危险区域,请注意安全", code: "02" },
    { text: "您的工卡已到期,请续费后使用", code: "0E" },
    { text: "您禁止进入该活动区域,请注意", code: "13" },
    { text: "您未穿戴安全防护设备,请注意", code: "14" },
    { text: "您的作业操作不符合标准规范,请注意", code: "15" },
    { text: "周边人员发生紧急情况,请即刻展开搜救", code: "18" },
  ];

  tableData: IStaff[] = [];

  constructor(private CarVideoService: CarVideoService,
    private ref: ChangeDetectorRef,
    private message: NzMessageService,
    private EleFenceService: EleFenceService,
    private modal: NzModalService,) { }

  ngOnInit(): void {
    this.CarVideoService.staffList$.asObservable().pipe(
      take(2)
    ).subscribe(res => {
      this.staffList = this.sortTableData(res);
      this.tableData = this.staffList;
    })
  }
  public onWorkCardUpdated(workCardList): void {
    const staffList = cloneDeep(workCardList);
    this.tableData.forEach(item => {
      const staff = staffList.filter(l => l.id === item.id);
      if(staff.length > 0) {
        item.isWorkCardActive = staff[0].isWorkCardActive;
      }
    });

    this.ref.markForCheck();
    this.ref.detectChanges();
  }

/**
 * @description: 排序
 * @param {*}
 * @return {*}
 */  
  private sortTableData(res) {
    let onLine = [];
    let offLine = [];
    let undefine = [];
    res.forEach(item => {
      if(item.isWorkCardActive == '在线') {
        onLine.push(item);
      } else if(item.isWorkCardActive == '离线') {
        offLine.push(item);
      } else if(typeof(item.isWorkCardActive) == 'undefined') {
        undefine.push(item);
      }
    });
    // @ts-ignore
    return [...onLine, ...offLine, ...undefine];
  }
  // 点击下一页
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<IStaff>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  //  点击按钮
  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      const staff = this.CarVideoService.staffList.filter(item => item.id === id);
      if (staff.length > 0 && staff[0].isWorkCardActive === '离线') {
        this.message.info('该人员已离线');
        return;
      } else {
        this.setOfCheckedId.add(id);
      }
    } else {
      this.setOfCheckedId.delete(id);
    };
    this.staffOfCheckedId.emit(Array.from(this.setOfCheckedId));
  }

  // 搜索
  searchChange(value) {
    if (value == '') {
      this.tableData = this.staffList;
      return;
    }
    this.tableData = this.staffList.filter(item => item.name.includes(value) || item.company.includes(value))
  }

  // 发送指令
  sendInstruction(instruction, row) {
    // $("document").click();
    console.log('instruction :>> ', instruction);
    console.log('row :>> ', row);
    // if (row.isWorkCardActive === "离线") {
    //   return this.message.error("设备离线，无法发送指令");
    // }
    if (typeof (row.workCardEntityId) === 'undefined') return;
    this.modal.confirm({
      nzTitle: '<i>确认发送指令</i>',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: () => {
        const payload = {
          method: "lora",
          params: {
            applicationId: 1,
            devEUI: row.workCard,
            func_code: instruction.code,
          },
          timeout: 10000,
        };
        this.EleFenceService.sendInstruction(row.workCardEntityId, payload).subscribe({
          next: res => {
            this.message.success('指令发送成功');
            console.log('res :>> ', res);
          },
          error: (err) => {
            console.log('err :>> ', err);
            this.message.error(err.message)
          }
        })
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
      }
    });
  }
}
