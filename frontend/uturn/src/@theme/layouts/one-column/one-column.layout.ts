import {Component} from '@angular/core';
import {Router} from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import {NbSidebarService} from '@nebular/theme';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <div class="d-flex w-100 justify-content-between">
          <h5>
            Uturn
          </h5>
          <div>
            <button *ngIf="authStatus" nbButton outline status="info" (click)="redirect('/auth/logout')">
              <nb-icon icon="power-outline"></nb-icon>
            </button>
          </div>

        </div>
      </nb-layout-header>

      
      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive start fixed="false" [hidden]="hideSideBar"
                  [state]="'compacted'">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <nb-icon icon="star"></nb-icon> <nb-icon icon="arrow-circle-right"></nb-icon> <nb-icon icon="github"></nb-icon>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  hideSideBar: boolean = false;
  authStatus = false;

  constructor(private router: Router, private sideBarService: NbSidebarService, private auth: NbAuthService) {
    this.auth.isAuthenticated().subscribe(authStatus => {
      this.authStatus = authStatus;
      }
    )
  }

  redirect(link: string) {
    this.router.navigate(['/auth/logout'])
  }
}
