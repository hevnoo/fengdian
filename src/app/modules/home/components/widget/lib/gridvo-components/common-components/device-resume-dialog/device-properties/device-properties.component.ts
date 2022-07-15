import { FormBuilder, Validators } from "@angular/forms";
import { filter } from "rxjs/operators";
import { NzMessageService } from "ng-zorro-antd/message";
import { EntityId } from "./../../../../../../../../../shared/models/id/entity-id";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AttributeService } from "@app/core/http/attribute.service";
import { WidgetContext } from "@home/models/widget-component.models";
import { AttributeScope } from "@app/shared/models/telemetry/telemetry.models";
import { th } from "date-fns/locale";
import { validate } from "@material-ui/pickers";
interface deviceInfo {
  entityId: string;
  [propname: string]: any;
}
@Component({
  selector: "tb-device-properties",
  templateUrl: "./device-properties.component.html",
  styleUrls: ["./device-properties.component.scss"],
})
export class DevicePropertiesComponent implements OnInit {
  dosenotExit = [
    "active",
    "inactivityAlarmTime",
    "lastActivityTime",
    "lastConnectTime",
    "lastDisconnectTime",
  ];
  @Input() ctx: WidgetContext;
  //当前打开弹窗的设备
  @Input() item: deviceInfo;
  //所有的设备信息
  @Input() fullDeviceData: deviceInfo[];
  addDeviceData;
  addDataValue;
  checkedAllDelete = true;
  checkedAllAdd = true;
  constructor(
    private attributeService: AttributeService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addDataValue = this.fb.group({
      key: ["", [Validators.required]],
      value: [""],
    });
    this.attributeService
      .getEntityAttributes(
        { id: this.item.entityId, entityType: this.item.entityType },
        AttributeScope.SERVER_SCOPE
      )
      .subscribe((res) => {
        this.addDeviceData = res;
      });
  }
  cancel() {}
  deleteDevice(device) {
    this.attributeService
      .deleteEntityAttributes(
        { id: this.item.entityId, entityType: this.item.entityType },
        AttributeScope.SERVER_SCOPE,
        [device]
      )
      .subscribe((res) => {
        // console.log(res, "delete", [device])
        //所有同类型的设备的属性都删除
        //功能被去掉了
        // if (this.checkedAllDelete) {
        //   this.fullDeviceData.forEach(element => {
        //     if (element.name.val !== this.item.name.val && element.type.val === this.item.type.val) {
        //       this.attributeService.deleteEntityAttributes({ id: element.entityId, entityType: element.entityType },
        //         AttributeScope.SERVER_SCOPE, [device]).subscribe(res => {
        //           console.log(res, element, "删除设备")
        //         })
        //     }
        //   })
        // }
      });
    this.addDeviceData = this.addDeviceData.filter(
      (item) => item.key !== device.key
    );
  }
  submitForm(boo: boolean) {
    console.log(this.addDataValue, "form");
    if (
      this.addDataValue.valid &&
      this.addDataValue.value.key &&
      this.addDataValue.value.value &&
      boo
    ) {
      let key = this.addDataValue.value.key;
      this.attributeService
        .saveEntityAttributes(
          { id: this.item.entityId, entityType: this.item.entityType },
          AttributeScope.SERVER_SCOPE,
          [{ key: key, value: this.addDataValue.value.value }]
        )
        .subscribe((res) => {
          this.addDeviceData.push({
            key: key,
            value: this.addDataValue.value.value,
            lastUpdateTs: new Date().getTime(),
          });
          this.addDataValue.reset();
          // this.message.success("成功添加")
          //所有类型的设备都添加该属性
          //功能被去掉了
          // if (this.checkedAllAdd) {
          //   this.fullDeviceData.forEach(element => {
          //     if (element.name.val !== this.item.name.val && element.type.val === this.item.type.val) {
          //       this.attributeService.saveEntityAttributes({ id: element.entityId, entityType: element.entityType },
          //         AttributeScope.SERVER_SCOPE, [{ key: key, value: "", }]).subscribe(res => {
          //           console.log(res, element, "添加设备")
          //         })
          //     }
          //   })
          // }
        });
    } else {
      alert("请输入");
    }
  }
  ngOnChanges() {}
}
