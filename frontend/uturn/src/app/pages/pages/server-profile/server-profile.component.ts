import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalDataSource } from 'ng2-smart-table';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-server-profile',
  templateUrl: './server-profile.component.html',
  styleUrls: ['./server-profile.component.scss']
})
export class ServerProfileComponent implements OnInit {
  ServerForm = {
    url: '',
    token: ''
  }
  id: any;
  server_details : any;
  IP: any;
  OS: any;
  projects: any;
  commits: any;
  source: any;
  settings = {
    actions: { 
      custom: [
        {
          name: 'Rollback',
          title: 'Rollback'
        }
      ],
      delete: false,
      edit: false,
      add: false,
    },
    columns: {
      author_name: {
        title: 'Name',
        filter: false
      },
      author_email: {
        title: 'Email',
        filter: false
      },
      msg: {
        title: 'Message',
        filter: false
      },
      shahash: {
        title: 'Hash',
        filter: false,
        valuePrepareFunction: (shahash: any) => {
          return shahash.substring(0, 6);
        }
      },
    }
  };


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.id) {
      this.router.navigate(['/pages/dashboard']);
    }
    this.getServerDetails();
    this.getProjects();
  }

  async getServerDetails() {
    this.http.get(environment.url+"/servers/find/"+this.id).subscribe(res => {
      this.server_details = JSON.parse(JSON.stringify(res));
      this.IP = this.server_details.IP;
      this.OS = this.server_details.OS;
      this.ServerForm.token = this.server_details.token;
      this.ServerForm.url = this.server_details.uturn_server_url;
    })
  }

  async getProjects() {
    this.http.get(
      environment.url
      +'/servers/projects/',
      {
        params: {
          id: this.id
        }
      }
    ).subscribe(
      res => {
        this.projects = JSON.parse(JSON.stringify(res));
      }, error => {
        console.error(error);
      }
    )
  }

  async getCommits(project_id: any) {
    this.http.get(
      environment.url+'/servers/projects/commits/'+project_id,
    ).subscribe(
      res => {
        this.commits = JSON.parse(JSON.stringify(res)).results;
        this.source = new LocalDataSource(this.commits);
      }, errors => {
        console.log(errors);
      }
    )
  }

  async refreshProjectCommits(project_id: any) {
    this.http.get(
      environment.url+"/servers/projects/commits/refresh/",
      {
        params: {
          id: project_id,
        }
      }
    ).subscribe(
      res => {
        this.showToast('info', "Commits being fetched.");
      }, error => {
        this.showToast('warning', "Error in refershing projects.");
      }
    )
  }

  async rollback($event: any) {
    console.log($event);
    
    let project_id: any = $event.data.project;
    let shahash: any = $event.data.shahash;
    // Fetch the above from $event
    const body = {
      id: project_id,
      shahash: shahash
    }
    this.http.post(
      environment.url+'/servers/projects/commits/rollback/',
      body
    ).subscribe(
      res => {
        console.log(res);
        this.showToast('success', "Rolling-back to commit.");
      }, errors => {
        console.log(errors);
        this.showToast('warning', "Error in rolling back to commit.");
      }
    )
  }

  async refreshProjects() {
    this.http.get(
      environment.url+"/servers/projects/refresh/",
      {
        params: {
          "id": this.id
        }
      }
    ).subscribe(
      res => {
        this.showToast('info', "Projects being fetched.");
      }, error => {
        this.showToast('warning', "Error in refershing commits.");
      }
    )
  }

  showToast(status: NbComponentStatus, message: String) {
    this.toastrService.show(status, message, { status });
  }

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'msg',
        search: query
      },
      {
        field: 'shahash',
        search: query
      },
      {
        field: 'author_name',
        search: query
      },
      {
        field: 'author_email',
        search: query
      }
    ], false); 
    // second parameter specifying whether to perform 'AND' or 'OR' search 
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
}
