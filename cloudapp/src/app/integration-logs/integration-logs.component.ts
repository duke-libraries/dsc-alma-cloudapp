import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import {CloudAppConfigService, AlertService} from '@exlibris/exl-cloudapp-angular-lib';
import { map, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-integration-logs',
  templateUrl: './integration-logs.component.html',
  styleUrls: ['./integration-logs.component.scss']
})
export class IntegrationLogsComponent implements OnInit {
  running = false;
  record: any;
  apiUrl!: string;

  constructor(
    private appService: AppService,
    private alert: AlertService,
    private configService: CloudAppConfigService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('Integration Logs');
    this.load();
  }

  load() {
    console.log('load');
    this.configService.get().subscribe( config => {
      this.apiUrl = config.apiUrl;
    });
  }

  search(logType: string) {
    const crsUrl = (logType: string) => `${this.apiUrl}/alma-integrations-logging/${logType}`;
    this.running = true;
    this.record = null;

    this.http.get<any>(crsUrl(logType))
      .pipe(
        map(res => {
          console.log(res);
          return res.map((item: any) => ({
            timestamp: item.timestamp,
            message: item.message,
            data: this.base64ToJson(item.data)
          }));
        }), 
        finalize(() => this.running = false)
      )
      .subscribe({
        next: resp => this.record = resp,
        error: e => this.alert.error(e.message)
      });
  }
  
  base64ToJson(base64String) {
    const json = Buffer.from(base64String, "base64").toString();
    return JSON.parse(json);
  }
}
