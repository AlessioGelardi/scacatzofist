import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierComponent } from './component/notifier/notifier.component';
import { NotifierButtonsComponent } from './component/notifier-buttons/notifier-buttons.component';
import { PlayerModule } from '../player/player.module';



@NgModule({
  declarations: [
    NotifierComponent,
    NotifierButtonsComponent
  ],
  imports: [
    PlayerModule,
    CommonModule
  ]
})
export class NotifierModule { }
