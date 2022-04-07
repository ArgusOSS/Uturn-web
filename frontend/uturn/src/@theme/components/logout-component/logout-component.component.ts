import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbTokenService } from '@nebular/auth';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout-component.component.html',
  styleUrls: ['./logout-component.component.scss']
})
export class LogoutComponentComponent implements OnInit {

  constructor(private token: NbTokenService, private router: Router) { }

  ngOnInit(): void {
    this.logout();
  }

  async logout() {
    this.token.clear();
    this.router.navigate(['/auth/login']);    
  }

}
