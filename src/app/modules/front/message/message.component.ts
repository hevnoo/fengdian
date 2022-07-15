import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { TabsService } from "@app/core/services/tabs.service";
import { Router } from "@angular/router";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from "ng-zorro-antd/dropdown";
import { deepClone } from "@app/core/utils";
import { differenceInCalendarDays, setHours } from "date-fns";
import { MessageManageService } from "@app/core/http/mesage-manage.service";
import { DisabledTimeFn, DisabledTimePartial } from "ng-zorro-antd/date-picker";
import { NzMessageService } from "ng-zorro-antd/message";
import { PageLink } from "@app/shared/models/page/page-link";
import { UserService } from "@app/core/http/user.service";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { getSyntheticPropertyName } from "@angular/compiler/src/render3/util";
import { DeviceService } from "@app/core/public-api";
//去掉了发消息的功能，只剩发短信
@Component({
  selector: "tb-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"],
})
export class MessageComponent implements OnInit {
  //存放人员列表
  personOption;
  isLoading: boolean = true;
  reserviceDataForm: FormGroup;
  isSelect: boolean = true;
  @Output() handleCancle = new EventEmitter();
  constructor(
    private message: NzMessageService,
    private MessageManageService: MessageManageService,
    private userService: UserService,
    private fb: FormBuilder,
  ) { }
  confirmSend() {
    if (!this.reserviceDataForm.valid) {
      Object.values(this.reserviceDataForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else {
      let params = {
        content: this.reserviceDataForm.value.reserviceContent,
        receiver: [
          {
            id: this.isSelect ? this.reserviceDataForm.value.reservicePhoneOfSelect : null,
            phone: this.isSelect ? this.personOption.filter(item => item.value === this.reserviceDataForm.value.reservicePhoneOfSelect)[0].phone : +this.reserviceDataForm.value.reserviPhone
          }
        ],
        sendTime: this.reserviceDataForm.value.reserviceDate,
      };
      this.MessageManageService.sendMessage(params).subscribe(
        (res) => {
          this.message.success("发送成功");
          this.reserviceDataForm.reset();
        },
        (err) => {
          this.message.error(err.error.detail);
        }
      );
    }
  }
  ngOnInit() {
    this.reserviceDataForm = this.fb.group({
      reservicePhoneOfSelect: [null, [Validators.required]],
      // reserviPhone: [null, [Validators.required, this.verifyPhone]],
      reserviceDate: [null, [Validators.required]],
      reserviceContent: [null, [Validators.required]],
    });
    this.getUserOption();
  }
  verifyPhone(control) {
    let params = /[1][3,4,5,8,9][0-9]{9}/
    //如果是选择框那么用户不可能选择错误
    if (params.exec(control.value)) {
      return null
    } else {
      return { reserviphone: true }
    }
  }
  //选择框和输入框相互切换
  changeSelectInput() {
    this.isSelect = !this.isSelect
    this.reserviceDataForm.removeControl('reserviPhone')
    this.reserviceDataForm.removeControl('reservicePhoneOfSelect')
    if (!this.isSelect) {
      this.reserviceDataForm.addControl('reserviPhone', this.fb.control(null))
    } else {
      this.reserviceDataForm.addControl('reservicePhoneOfSelect', this.fb.control(null))
    }
  }
  getUserOption() {
    this.personOption = [];
    let pageLinkOfUser = new PageLink(1000, 0);
    this.userService.getUsers(pageLinkOfUser).subscribe(
      (res) => {
        if (res) {
          res.data.forEach((item) => {
            this.getPhone(item)
          });
          console.log(this.personOption, 'personOption', res)
        }
      },
      (err) => {
        console.log("查找人员err", err);
      }
    );
  }
  getPhone(userList) {
    //因为目前一个租户一个电话号码，所以同一个租户的用户电话号码都一样，以至于选择的时候会有问题
    this.MessageManageService.getPhone(userList.id.id).subscribe((phone) => {
      this.personOption.push({
        label: `${userList.lastName || ""}${userList.firstName || ""}-${phone}`,
        phone: phone,
        value: userList.id.id
      });
      this.isLoading = false;
    });
  }
}
