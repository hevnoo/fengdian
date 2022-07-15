///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { PageComponent } from '@shared/components/page.component';
import { FormBuilder,FormGroup, Validators  } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from '@shared/models/constants';
import { Router } from '@angular/router';
import { OAuth2ClientInfo } from '@shared/models/oauth2.models';
import { LoginPageStyleService, loginStyleTypeEnum, LoginStyleType, loginStyleList } from '@app/core/http/login-page-style.service'

import { isMobile } from "@core/utils";
import { GridvoMobileService } from "@core/services/gridvo-mobile.service";

type CunstomStyleType = {
  backgroundSizeMode: string,
  backgroundImage: string,
  leftBackgroundSizeMode: string,
  leftBackgroundImage: string,
  leftTitle: string,
  leftTitleColor: string,
  rightButtonColor: string,
  rightButtonTextColor: string,
  rightLogo: string
}


@Component({
  selector: 'tb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends PageComponent implements OnInit {
  defaultLeftLogo = "../../../../../assets/gridvo/login/login_left_icon.jpg"
  passwordVisible = false;
  loginFormGroup = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });
  oauth2Clients: Array<OAuth2ClientInfo> = null;
  themeValue = localStorage.getItem('themeValue')

  isMobile: boolean;

  customStyle: CunstomStyleType = {
    backgroundSizeMode: "",
    backgroundImage: "",
    leftBackgroundSizeMode: "",
    leftBackgroundImage: "",
    leftTitle: "",
    leftTitleColor: "",
    rightButtonColor: "",
    rightButtonTextColor: "",
    rightLogo: ""
  }

  loginStyleList: Array<LoginStyleType> = loginStyleList
  isImageList: string[] = (function() {
    return loginStyleList.map((item: LoginStyleType) => {
      if(item.type === loginStyleTypeEnum.IMAGE) {
        return item.formControlName
      }
    })
  })()



  constructor(protected store: Store<AppState>,
    private authService: AuthService,
    public fb: FormBuilder,
    private router: Router,
    private loginStyleServe: LoginPageStyleService,
    private GMService: GridvoMobileService) {
    super(store);
  }

  ngOnInit() {
    this.oauth2Clients = this.authService.oauth2Clients;
    this.isMobile = isMobile();
    this.loginStyleServe.getLoginStyle("loginStyleSettings").subscribe(res => {
      Object.keys(res).forEach(key => {
        if(this.isImageList.includes(key)) {
          res[key] && res[key].content ? this.customStyle[key] = res[key].prefix + ',' + res[key].content : null
        } else {
          this.customStyle[key] = res[key]
        }
      })
    })

    this.GMService.isGridvoChatApp() && this.GMService.getThingsBoardToken();
  }

  login(): void {
    if (this.loginFormGroup.valid) {
      this.authService.login(this.loginFormGroup.value).subscribe(
        () => { },
        (error: HttpErrorResponse) => {
          if (error && error.error && error.error.errorCode) {
            if (error.error.errorCode === Constants.serverErrorCode.credentialsExpired) {
              this.router.navigateByUrl(`login/resetExpiredPassword?resetToken=${error.error.resetToken}`);
            }
          }
        }
      );
    } else {
      Object.keys(this.loginFormGroup.controls).forEach(field => {
        const control = this.loginFormGroup.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

}
