import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import {CloudAppConfigService, AlertService} from '@exlibris/exl-cloudapp-angular-lib';
import { map, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-item-history',
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.scss']
})
export class ItemHistoryComponent implements OnInit {
  running = false;
  record: any;
  apiUrl!: string;
  histRecord: any;
  searchHistType: string;

  constructor(
    private appService: AppService,
    private alert: AlertService,
    private configService: CloudAppConfigService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('Aleph Item History');
    this.load();
  }

  load() {
    console.log('load');
    this.configService.get().subscribe( config => {
      this.apiUrl = config.apiUrl;
    });
  }

  // type barcode => bc, itemId => id
  searchHistory(idType: string, id: string) {
    const itmHistUrl = (idType: string, id: string) => `${this.apiUrl}/item-history/${idType}/${id}`;
    this.running = true;
    this.histRecord = null;
    this.searchHistType = idType;
    
    this.http.get<any>(itmHistUrl(idType, id))
      .pipe(
        map(res => {
          console.log(res);
          return res
        }), 
        finalize(() => this.running = false)
      )
      .subscribe({
        next: resp => this.histRecord = resp,
        error: e => this.alert.error(e.message)
      });
  }
  
}
