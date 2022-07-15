import { NzMessageService } from "ng-zorro-antd/message";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DefectManagementService } from "@app/core/http/defect-management.service";
import { PageLink } from "@app/shared/models/page/page-link";
import { UserService } from "@app/core/http/user.service";
import { DeviceService } from "@app/core/http/device.service";
import { DeviceProfileService } from "@app/core/http/device-profile.service";
import { RegularInspectionService } from "@app/core/http/regular-inspection.service";
import { TabsService } from "@app/core/services/tabs.service";
import { GfDayUtils } from "../../common/utils";
import { getCurrentAuthState } from "@core/auth/auth.selectors";
import { AuthState } from "@core/auth/auth.models";
import { Store } from "@ngrx/store";
import { AppState } from "@core/core.state";
import moment from "moment";
import { myText } from "./myText";
import { ContactSupportOutlined } from "@material-ui/icons";
@Component({
  selector: "tb-fd-app-my-dealt",
  templateUrl: "./fd-app-my-dealt.component.html",
  styleUrls: ["./fd-app-my-dealt.component.scss"],
})
export class FdAppMyDealtComponent implements OnInit {
  @Input() ctx: WidgetContext;
  text: string = myText.myOrder;
  headText = [
    {
      value: "full",
      label: "全部",
    },
    {
      value: "week",
      label: "本周",
    },
    {
      value: "day",
      label: "今天",
    },
  ];
  authState: AuthState = getCurrentAuthState(this.store);
  page: number = 0;
  defectData: any[] = [];
  inspection: any[] = [];
  defectDataOfTime: any[] = [];
  defectId: string = "";
  isClickText: string = "full";
  constructor(
    private fb: FormBuilder,
    protected store: Store<AppState>,
    private defectManagementService: DefectManagementService
  ) {}

  ngOnInit(): void {
    this.ctx.$scope.fdAppMyDealtWidget = this;
    this.defectId = this.ctx.settings.defectId;
    this.initDefectList();
  }
  changeTime(text: string) {
    this.isClickText = text;
    let time = new Date().getTime();
    if (text === this.headText[0].value) {
      this.defectDataOfTime = this.defectData;
    } else if (text === this.headText[1].value) {
      let startTime = moment().startOf("week").valueOf();
      let endTime = moment().endOf("week").valueOf();
      this.defectDataOfTime = this.defectData.filter((item) => {
        return (
          item.processInstanceDO.startTime >= startTime &&
          item.processInstanceDO.startTime <= endTime
        );
      });
    } else {
      let startTime = moment().startOf("day").valueOf();
      let endTime = moment().endOf("day").valueOf();
      this.defectDataOfTime = this.defectData.filter(
        (item) =>
          item.processInstanceDO.startTime >= startTime &&
          item.processInstanceDO.startTime <= endTime
      );
    }
  }
  //得到对应日期的周一
  getFirstDayOfWeek(date) {
    var day = date.getDay() || 7;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1 - day
    );
  }
  goToDefectReport(value) {
    console.log(value);
    let params = {
      entityId: this.ctx.datasources?.[0].entity.id,
      entityName: this.ctx.datasources?.[0].entityName,
    };
    localStorage.setItem(
      "nameOfFromPage",
      this.ctx.stateController.getStateId()
    );
    console.log("缺陷", this.ctx.stateController);
    localStorage.setItem("fromPageUrl", location.href);
    //将当前点击的设备缺陷的值写到localStorage中
    localStorage.setItem("clickDefect", JSON.stringify(value));
    this.ctx.stateController.updateState(
      this.defectId || "process",
      params,
      false
    );
  }
  initDefectList() {
    this.text = this.ctx.settings.text || myText.myOrder;
    let params = `pageSize=${100}&page=${this.page}&userIds=${
      this.authState.authUser.userId
    }`;
    if (this.text === myText.myOrder) {
      this.defectManagementService.getToDoWorkOrderList(params).subscribe(
        (res) => {
          if (res.hasNext) {
            this.defectData = [];
          }
          this.page++;
          this.defectData = res.data;
          this.defectDataOfTime = this.defectData;
          this.ctx.detectChanges();
        },
        (err) => {
          console.log("请求列表err :>> ", err);
        }
      );
    } else if (this.text === myText.myStart) {
      this.defectManagementService.getMyOrderList(params).subscribe(
        (res) => {
          if (res.hasNext) {
            this.defectData = [];
          }
          this.page++;
          this.defectData = res.data;
          this.defectDataOfTime = this.defectData;
          this.ctx.detectChanges();
        },
        (err) => {
          console.log("请求列表err :>> ", err);
        }
      );
    } else if (this.text === myText.search) {
      params += "&startUserId=" + this.authState.authUser.userId;
      this.defectManagementService.getMyOrderList(params).subscribe(
        (res) => {
          if (res.hasNext) {
            this.defectData = [];
          }
          this.page++;
          this.defectData = res.data;
          this.defectDataOfTime = this.defectData;
          this.ctx.detectChanges();
        },
        (err) => {
          console.log("请求列表err :>> ", err);
        }
      );
    }
  }
}
