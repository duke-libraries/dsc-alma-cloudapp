import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import {CloudAppConfigService, AlertService} from '@exlibris/exl-cloudapp-angular-lib';
import { map, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loan-history',
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.scss']
})
export class LoanHistoryComponent implements OnInit {
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
    this.appService.setTitle('Aleph Loan History');
    this.load();
  }

  load() {
    this.configService.get().subscribe( config => {
      this.apiUrl = config.apiUrl;
      if (this.apiUrl === undefined) {
        this.alert.error('Please add DSC api url to settings.');
      }
    });
  }

  // type barcode => bc, itemId => id
  searchHistory(idType: string, id: string) {
    const itmHistUrl = (idType: string, id: string) => `${this.apiUrl}/loan-history/${idType}/${id}`;
    this.running = true;
    this.histRecord = null;
    this.searchHistType = idType;
    
    this.http.get<any>(itmHistUrl(idType, id))
      .pipe(
        map(res => {
          // console.log(res);
          res.sort((a, b) => {
              const iA = a.loanDate;
              const iB = b.loanDate;
              if (iA < iB) {
                return 1;
              }
              if (iA > iB) {
                return -1;
              }
              return 0;
            });
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
