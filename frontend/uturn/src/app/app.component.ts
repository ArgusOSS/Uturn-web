import {Component} from '@angular/core';
import {NbAuthService} from '@nebular/auth';
import {Observable,} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AmIFree?';
  isAuthenticated$: Observable<boolean>;

  constructor(private auth: NbAuthService) {
    this.isAuthenticated$ = this.auth.isAuthenticated();
  }


}
