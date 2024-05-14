import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IntegrationLogsComponent } from './integration-logs/integration-logs.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'integrationlogs', component: IntegrationLogsComponent },
  { path: 'configuration', component: ConfigurationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
