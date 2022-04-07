import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NbAuthComponent, NbLogoutComponent,} from '@nebular/auth';
import {NgxLoginComponent} from 'src/@theme/components/login-component/login.component';
import { LogoutComponentComponent } from 'src/@theme/components/logout-component/logout-component.component';
import {AuthGuard} from './utils/auth-guard.service';

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: NgxLoginComponent,
      },
      {
        path: "logout",
        component: LogoutComponentComponent
      }
    ],
  },
  {path: '', redirectTo: 'pages/dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'pages/dashboard'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
