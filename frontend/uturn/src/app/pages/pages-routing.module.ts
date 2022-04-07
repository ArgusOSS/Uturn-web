import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {PagesComponent} from "./pages/pages.component";
import { AlertsComponent } from './pages/alerts/alerts.component';
import { ServerProfileComponent } from './pages/server-profile/server-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "alerts",
        component: AlertsComponent
      },
      {
        path: "server/:id",
        component: ServerProfileComponent
      }
    ],
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard'},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {

}
