import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierComponent } from './component/notifier/notifier.component';
import { NotifierButtonsComponent } from './component/notifier-buttons/notifier-buttons.component';



@NgModule({
  declarations: [
    NotifierComponent,
    NotifierButtonsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NotifierModule { }
