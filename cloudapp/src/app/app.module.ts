import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, CloudAppTranslateModule, AlertModule, MenuModule } from '@exlibris/exl-cloudapp-angular-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { IntegrationLogsComponent } from './integration-logs/integration-logs.component';
import { ItemHistoryComponent } from './item-history/item-history.component';
import { LoanHistoryComponent } from './loan-history/loan-history.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
import Material from '@primeng/themes/material';
import { providePrimeNG } from 'primeng/config';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    IntegrationLogsComponent,
    ConfigurationComponent,
    TopmenuComponent,
    ItemHistoryComponent,
    LoanHistoryComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,     
    CloudAppTranslateModule.forRoot(),
    MenuModule,
    PopoverModule,
    ButtonModule,
    DrawerModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    providePrimeNG({
      theme: {
          preset: Material
      }
  })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
