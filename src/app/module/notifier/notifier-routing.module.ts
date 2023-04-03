import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotifierComponent } from './component/notifier/notifier.component';

export const notifierRoutes: Routes = [
  { path: 'request', component: NotifierComponent }
];

@NgModule({
  imports: [RouterModule.forChild(notifierRoutes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
