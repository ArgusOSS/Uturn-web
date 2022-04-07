import { HttpClient } from '@angular/common/http';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  private index: number = 0;
  servers: any;

  ServerForm = {
    url: '',
    token: ''
  }

  constructor(private http: HttpClient, private toastrService: NbToastrService) { }

  ngOnInit(): void { 
    this.fetchServers();
  }

  async addServer(url: String, token: String) {
    const body : any = {
      uturn_server_url : url,
      token : token
    }
    console.log(url, token);
    this.http.post(environment.url + "/servers/info/", body).subscribe(res => {
      this.showToast('info', "Server being added");
    }, error => {
        this.showToast('danger', 'There was an error')
      })
  }

  async fetchServers() {
    this.http.get(environment.url + "/servers/info/").subscribe((res: any) =>{
      console.log(res);
      this.servers = JSON.parse(JSON.stringify(res));
    }, error => {
      console.error(error)
    })
  }

  showToast(status: NbComponentStatus, message: String) {
    this.toastrService.show(status, message, { status });
  }
}
