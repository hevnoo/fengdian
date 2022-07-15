import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FrontComponent } from './front.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { StoreModule } from '@ngrx/store';
import { Authority } from '@shared/models/authority.enum';

const routes: Routes = [
  { path: 'front',
    component: FrontComponent,
    data: {
      auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
      title: 'home.home',
      breadcrumb: {
        skip: true
      }
    },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    // loadChildren: () => import('../home/pages/home-pages.module').then(m => m.HomePagesModule)
    loadChildren: () => import('../dashboard/dashboard-pages.module').then(m => m.DashboardPagesModule)
  }
];

@NgModule({
  imports: [
    StoreModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class FrontRoutingModule { }
