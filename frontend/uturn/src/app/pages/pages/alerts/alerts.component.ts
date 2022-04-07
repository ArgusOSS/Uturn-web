import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  alerts: any;
  tree_data: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.FetchAlerts();
  }

  async FetchAlerts() {
    this.http.get(
      environment.url + "/servers/alerts/",
    ).subscribe(
      res => {
        this.alerts = JSON.parse(JSON.stringify(res)).results;
      
      }, errors => {
        console.log(errors);
      }
    )
  }

}
