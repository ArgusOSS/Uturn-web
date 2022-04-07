import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {NbAuthResult, NbAuthService, NbLoginComponent} from '@nebular/auth';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  providers: [CommonModule]
})
export class NgxLoginComponent extends NbLoginComponent {
  
}
