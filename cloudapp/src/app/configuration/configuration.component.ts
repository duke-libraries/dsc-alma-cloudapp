import { Component, OnInit, Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ErrorMessages } from '../static/error.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private configService: CloudAppConfigService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.appService.setTitle('Configuration');
    this.form = this.fb.group({
      apiUrl: this.fb.control('')
    });
    this.load();
  }

  load() {
    // this.configService.remove().subscribe( () => console.log('removed') );
    this.configService.getAsFormGroup().subscribe( config => {
      console.log(config);
      if (Object.keys(config.value).length!=0) {
        this.form = config;
      }
    });   
  }

  save() {
    this.saving = true;
    this.configService.set(this.form.value).subscribe(
      () => {
        this.alert.success('Configuration successfully saved.');
        this.form.markAsPristine();
      },
      err => this.alert.error(err.message),
      ()  => this.saving = false
    );
  }  
}
