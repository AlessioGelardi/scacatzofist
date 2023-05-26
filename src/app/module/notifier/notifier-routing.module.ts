import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotifierComponent } from './component/notifier/notifier.component';
import { NotifierHistoryComponent } from './component/notifier-history/notifier-history.component';

export const notifierRoutes: Routes = [
  { path: 'request', component: NotifierComponent },
  { path: 'ntfrHistory', component: NotifierHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(notifierRoutes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
