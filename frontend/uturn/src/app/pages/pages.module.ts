import {NgModule} from '@angular/core';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages/pages.component';
import {ThemeModule} from "../../@theme/theme.module";
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbMenuModule,
  NbSelectModule,
  NbSpinnerModule, NbTooltipModule,
  NbRadioModule,
  NbUserModule,
  NbTreeGridModule
} from "@nebular/theme";
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { ServerProfileComponent } from './pages/server-profile/server-profile.component';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    AlertsComponent,
    ServerProfileComponent
  ],
  imports: [
    Ng2SmartTableModule,
    NbRadioModule,
    CommonModule,
    FormsModule,
    NbEvaIconsModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
    NbListModule,
    NbCheckboxModule,
    NbSelectModule,
    NbAlertModule,
    NbIconModule,
    NbTooltipModule,
    NbUserModule
  ]
})
export class PagesModule {
}
