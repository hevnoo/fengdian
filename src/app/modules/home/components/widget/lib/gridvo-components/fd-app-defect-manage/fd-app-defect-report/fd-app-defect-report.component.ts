import { NzMessageService } from "ng-zorro-antd/message";
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { WidgetContext } from "@home/models/widget-component.models";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DefectManagementService } from "@app/core/http/defect-management.service";
import { PageLink } from "@app/shared/models/page/page-link";
import { UserService } from "@app/core/http/user.service";
import { DeviceService } from "@app/core/http/device.service";
import { DeviceProfileService } from "@app/core/http/device-profile.service";
import { isMobile } from "@core/utils";
import { Location } from "@angular/common";
import {
  GridvoMobileService,
  CameraType,
} from "@core/services/gridvo-mobile.service";
interface image {
  path: string;
}
@Component({
  selector: "tb-fd-app-defect-report",
  templateUrl: "./fd-app-defect-report.component.html",
  styleUrls: ["./fd-app-defect-report.component.scss"],
})
export class FdAppDefectReportComponent implements OnInit {
  @Input() ctx: WidgetContext;
  bpmnSrc: string = "";
  searchDevice: string = "";
  subEquId: string = "";
  image: image[] | null = null;
  buttonArr: string[] = ["缺陷管理", "流程图"];
  // 缺陷等级
  defectLevelOption = [
    { label: "一级", value: 0 },
    { label: "二级", value: 1 },
    { label: "三级", value: 2 },
    { label: "四级", value: 3 },
  ];
  isDeviceDefect: number = 1;
  deviceOption = [];
  showDeviceOption = [];
  deviceType = [];
  isclickText = "缺陷管理";
  defectReportFormData: FormGroup;
  personOption = [];
  public searchParams = {
    describe: "", //缺陷描述
    time: [],
    // level: null, //缺陷等级
    level: "",
  };
  isShowDeviceList = false;
  isSpinning = false; // 用于照片上传加载中
  constructor(
    private fb: FormBuilder,
    private defectManagementService: DefectManagementService,
    private userService: UserService,
    private deviceService: DeviceService,
    private deviceProfileService: DeviceProfileService,
    private message: NzMessageService,
    private GMService: GridvoMobileService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.ctx.$scope.fdAppDefectReportWidget = this;
    this.defectReportFormData = this.fb.group({
      findTheTime: [null],
      quotId: [null],
      subEquId: [null],
      number: [null],
      type: [null],
      assignee: [null],
      level: [null],
      describe: [null, [Validators.required]],
      remark: [null],
      motif: [null, [Validators.required]],
    });
    this.getUserOption();
    this.getDevice();
    this.getDeviceType();
    // this.changeContent()
  }
  getValueOfDevice(value) {
    this.subEquId = value;
  }
  getValueOfDeviceType(value) {
    this.defectReportFormData.get("type").setValue(value);
  }
  getValueOfAssignee(value) {
    this.defectReportFormData.get("assignee").setValue(value);
  }
  getValueOfLevel(value) {
    this.defectReportFormData.get("level").setValue(value);
  }
  getValueOfQuotId(value) {
    this.defectReportFormData.get("quotId").setValue(value);
  }
  changeText(text: string) {
    this.isclickText = text;
    if (this.bpmnSrc.length == 0) this.changeContent();
  }
  changeContent() {
    let page = `page=0&pageSize=1`;

    this.defectManagementService.getToDoWorkOrderList(page).subscribe((res) => {
      let detailOfTask = res.data[0];
      let bpmnRes;
      let isFinished = detailOfTask.processInstanceDO.endTime ? true : false;
      if (isFinished) {
        this.defectManagementService
          .getRunTimeBpmnFile("defect")
          .subscribe((bpmnResData) => {
            bpmnRes = bpmnResData;
            this.bpmnSrc = `data:image/jpg;base64,${
              bpmnRes.diagram || bpmnRes.definedDiagram
            }`;
            this.ctx.detectChanges();
          });
      } else {
        this.defectManagementService
          .getBpmnFile(detailOfTask.processInstanceId)
          .subscribe((bpmnResData) => {
            bpmnRes = bpmnResData;
            this.bpmnSrc = `data:image/jpg;base64,${
              bpmnRes.diagram || bpmnRes.definedDiagram
            }`;
            this.ctx.detectChanges();
          });
      }
    });
  }
  photograph() {
    // this.isSpinning = true;
    const subjection = this.GMService.openCamera(
      CameraType.takePhotos
    ).subscribe({
      next: (res) => {
        $(".console").html(res);
        if (this.image) {
          this.image.push({ path: location.origin + res.data });
        } else {
          this.image = [{ path: location.origin + res.data }];
        }
        // this.message.success("上传成功！");
        this.isSpinning = false;
      },
      error: (err) => {
        this.message.error(err.message);
        this.isSpinning = false;
      },
      complete: () => {
        subjection?.unsubscribe();
        this.isSpinning = false;
      },
    });
  }
  submitForm() {
    if (this.defectReportFormData.valid) {
      let defectData = this.defectReportFormData.value;
      //这个是否是本设备的缺陷是按钮，所以手动赋值
      defectData.whetherDevice = this.isDeviceDefect;
      //不知道为什么html中formcontrolName设备为这个属性没有用，一直都是null，所以只好手动赋值
      defectData.subEquId = this.subEquId;
      //时间如果是字符串是不行的，然后input得到的就是字符串
      defectData.findTheTime = new Date(defectData.findTheTime);
      // defectData.linkUrl = `${location.origin}${this.ctx.settings.url}`
      defectData.attachments = this.image;
      this.defectManagementService
        .defectStart(this.defectReportFormData.value)
        .subscribe(
          (res) => {
            this.message.success("提交成功");
            this.location.back();
          },
          (err) => {
            this.message.error(err.error.detail);
          }
        );
    }
    this.userService.getUsers(new PageLink(100, 0)).subscribe;
  }
  getUserOption() {
    this.personOption = [];
    let pageLinkOfUser = new PageLink(1000, 0);
    this.userService.getUsers(pageLinkOfUser).subscribe(
      (res) => {
        if (res) {
          let userList = [];
          res.data.forEach((item) => {
            userList.push({
              label: `${item.firstName || ""}${item.lastName || ""}`,
              value: item.id.id,
            });
          });
          this.personOption = userList;
        }
      },
      (err) => {
        console.log("查找人员err", err);
      }
    );
  }
  getDevice() {
    let pageLink = new PageLink(10, 0);
    this.showDeviceOption = [];
    let hasNext;
    this.deviceService
      .getTenantDeviceInfos(new PageLink(1000, 0), "")
      .subscribe((data) => {
        hasNext = data.hasNext;
        if (data.hasNext) {
          pageLink.page += 1;
        }
        if (data.data) {
          this.deviceOption = [];
          this.showDeviceOption = [];
        }
        data.data.forEach((item) => {
          this.deviceOption.push({
            label: item.label.split("/").slice(-1)[0],
            value: item.id.id,
          });
        });
        this.showDeviceOption = this.deviceOption.slice(0, 10);
        this.ctx.detectChanges();
      });
  }
  getDeviceType() {
    let pageLink = new PageLink(1000, 0);
    let hasNext;
    this.deviceProfileService.getDeviceProfiles(pageLink).subscribe((res) => {
      hasNext = res.hasNext;
      if (res.hasNext) {
        pageLink.page += 1;
      }
      if (res.data) {
        this.deviceType = [];
      }
      res.data.forEach((item) => {
        this.deviceType.push({
          value: item.name,
          label: item.name,
        });
      });
      this.ctx.detectChanges();
    });
  }
}
