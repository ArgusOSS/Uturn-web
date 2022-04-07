import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbPopoverModule,
  NbRadioModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbThemeModule,
  NbToggleModule,
  NbTooltipModule,
  NbUserModule,
} from '@nebular/theme';
import {NbSecurityModule} from '@nebular/security';

import {OneColumnLayoutComponent} from './layouts';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TypeAheadComponent} from "./components/type-ahead/type-ahead.component";
import {NgSelectModule} from "@ng-select/ng-select";
import { NgxLoginComponent } from './components/login-component/login.component';
import { LogoutComponentComponent } from './components/logout-component/logout-component.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbDatepickerModule,
  NbCheckboxModule,
  NbListModule,
  NbInputModule,
  NbSpinnerModule,
  NbAlertModule,
  NbRadioModule, NbTooltipModule, NbPopoverModule, NbToggleModule,
  FormsModule,
  
];
const COMPONENTS = [OneColumnLayoutComponent, TypeAheadComponent];

const PIPES = [];

const ANGULAR_MODULES = [
  FormsModule,
  NbCardModule, RouterModule,
  NgSelectModule
];

const DIRECTIVES = [];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, ...ANGULAR_MODULES,],
  exports: [CommonModule, ...COMPONENTS],
  declarations: [...COMPONENTS, NgxLoginComponent, LogoutComponentComponent],
  entryComponents: [],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    // @ts-ignore
    return {
      ngModule: ThemeModule,
      providers: [
        // @ts-ignore
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
        ).providers,
      ],
    };
  }
}


