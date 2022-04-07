import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module'
import {AuthGuard} from './utils/auth-guard.service';
import {AppComponent} from './app.component';
import {ThemeModule} from "../@theme/theme.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from "../environments/environment";
import {NbAlertModule, NbIconModule, NbListModule, NbMenuModule, NbSidebarService, NbUserModule} from '@nebular/theme';
import { NbToastrModule } from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';

import {NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, } from '@nebular/auth';
import {NbFirebaseAuthModule, NbFirebaseGoogleStrategy} from '@nebular/firebase-auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule, PERSISTENCE} from '@angular/fire/compat/auth';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {DataService} from "./utils/data.service";
import {Interceptor} from "../config/http.intercepter";
import {CommonModule} from '@angular/common';
import { NbRadioModule } from '@nebular/theme';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NbIconModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ThemeModule.forRoot(),
    NbToastrModule.forRoot(),
    NbEvaIconsModule,
    NbRadioModule,
    NbAlertModule,
    NbEvaIconsModule,
    NbListModule,
    CommonModule,
    NbMenuModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: environment.url,
          token: {
            class: NbAuthJWTToken,
            key: 'tokens.access'
          },
          login: {
            endpoint: '/auth/login/',
            redirect: {
              success: '/pages/dashboard',
              failure: null,
            },
          },
        }),
      ],
      forms: {},
    }),
  ],
  providers: [
    NbFirebaseGoogleStrategy,
    AuthGuard, NbSidebarService, DataService,
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},
    {
      provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: function (req: any) {
        return req.url.indexOf('amazonaws') > -1;
      },
    },
    {provide: PERSISTENCE, useValue: 'local'},

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
