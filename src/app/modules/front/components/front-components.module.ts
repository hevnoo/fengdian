import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { NgZorroAntdModule } from "@shared/ngZorroAntd.module";

import { AccountComponent } from "@modules/front/components/account.component";
import { LogoComponent } from "@modules/front/components/logo.component";

const FrontComponents = [
  AccountComponent,
  LogoComponent
]

@NgModule({
  declarations:
    [...FrontComponents],
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule
  ],
  exports: [
    ...FrontComponents
  ]
})
export class FrontComponentsModule { }
