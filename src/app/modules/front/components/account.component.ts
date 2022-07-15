import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { getCurrentAuthState } from '@core/auth/auth.selectors';
import { AuthState } from '@core/auth/auth.models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TabsService } from "@core/services/tabs.service";
interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  newPassword2: string;
}

@Component({
  selector: 'tb-front-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Input() isCollapsed: boolean = false

  authState: AuthState = getCurrentAuthState(this.store);

  FirstAndLastName: string;

  isVisible: boolean = false;
  aboutUsVisible: boolean = false

  changePassword: IChangePassword = {
    currentPassword: '',
    newPassword: '',
    newPassword2: ''
  }

  constructor(protected store: Store<AppState>,
    private authService: AuthService,
    private message: NzMessageService,
    private TabsService: TabsService) {
  }

  ngOnInit() {
    this.FirstAndLastName = `${this.authState.authUser.firstName ?? ''}${this.authState.authUser.lastName ?? ''}`;
  }

  logout(): void {
    this.authService.logout();
    this.TabsService.reset();
  }

  resetPassword() {
    this.isVisible = true;
  }

  aboutUs() {
    this.aboutUsVisible = true
  }

  handleOk(): void {
    if (this.changePassword.currentPassword == '') {
      this.message.info("请输入当前密码再提交！");
      return;
    }
    if (this.changePassword.newPassword == '' || this.changePassword.newPassword2 == '') {
      this.message.info("请输入新密码");
      return;
    }
    if (this.changePassword.newPassword !== this.changePassword.newPassword2) {
      this.message.info("两次密码输入不一致！请重新输入");
      return;
    }
    if (this.changePassword.newPassword !== '' &&
      this.changePassword.newPassword2 !== '' &&
      this.changePassword.currentPassword !== '' &&
      this.changePassword.newPassword === this.changePassword.newPassword2) {
      this.authService.changePassword(
        this.changePassword.currentPassword,
        this.changePassword.newPassword).subscribe({
          next: () => {
            this.isVisible = false;
            this.message.success('密码修改成功！')
          },
          error: (err) => {
            this.message.error('当前密码输入有误,请重新输入')
          }
        });
    }
  }

  handleCancel() {
    this.isVisible = false;
  }
}
