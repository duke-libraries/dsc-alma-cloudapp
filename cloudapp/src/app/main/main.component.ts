import { Observable  } from 'rxjs';
import { finalize, tap, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService, CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../app.service';
import { menu } from './main-menu';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  // imports: [ButtonDirective, PopoverDirective]
})
export class MainComponent implements OnInit, OnDestroy {
  isAdmin = false;
  menu = menu;
  loading = false;
  selectedEntity!: Entity;
  apiResult: any;
  histRecord: any;
  apiUrl!: string;
  running = false;
  searchHistType: string;

  entities$: Observable<Entity[]> = this.eventsService.entities$
  .pipe(tap(() => this.clear()))

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private appService: AppService,
    private http: HttpClient,
    private configService: CloudAppConfigService,
  ) { }

  ngOnInit() {
    this.appService.setTitle('');
    this.eventsService.getInitData().subscribe(data=>this.isAdmin = data.user.isAdmin)
    this.load();
  }

  load() {
    console.log('load');
    this.configService.get().subscribe( config => {
      this.apiUrl = config.apiUrl;
    });
  }

  ngOnDestroy(): void {
  }

  entitySelected(event: MatRadioChange) {
    const value = event.value as Entity;
    console.log(value);
    this.loading = true;
    if (value.type === 'ITEM') {
      const barcode = value.description;
      const itmHistUrl = (barcode: string) => `${this.apiUrl}/item-history/${barcode}`;
      this.histRecord = null;

      this.http.get<any>(itmHistUrl(barcode))
        .pipe(
          map(res => {
            console.log(res);
            return res
          }), 
          finalize(() => this.loading = false)
        )
      //   .subscribe({
      //     next: resp => this.record = resp,
      //     error: e => this.alert.error(e.message)
      //   });
      this.loading=false;   
    } else {
      this.restService.call<any>(value.link)
      .pipe(finalize(()=>this.loading=false))
      .subscribe(
        result => this.apiResult = result,
        error => this.alert.error('Failed to retrieve entity: ' + error.message)
      );
    }
  }

  clear() {
    this.apiResult = null;
    this.selectedEntity = null;
  }

  update(value: any) {
    const requestBody = this.tryParseJson(value)
    if (!requestBody) return this.alert.error('Failed to parse json');

    this.loading = true;
    let request: Request = {
      url: this.selectedEntity.link, 
      method: HttpMethod.PUT,
      requestBody
    };
    this.restService.call(request)
    .pipe(finalize(()=>this.loading=false))
    .subscribe({
      next: result => {
        this.apiResult = result;
        this.eventsService.refreshPage().subscribe(
          ()=>this.alert.success('Success!')
        );
      },
      error: (e: RestErrorResponse) => {
        this.alert.error('Failed to update data: ' + e.message);
        console.error(e);
      }
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

  private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }
}