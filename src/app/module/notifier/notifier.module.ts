import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierComponent } from './component/notifier/notifier.component';
import { NotifierButtonsComponent } from './component/notifier-buttons/notifier-buttons.component';
import { NotifierHistoryComponent } from './component/notifier-history/notifier-history.component';



@NgModule({
  declarations: [
    NotifierComponent,
    NotifierButtonsComponent,
    NotifierHistoryComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NotifierModule { }
