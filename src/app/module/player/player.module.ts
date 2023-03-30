import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatusComponent } from './component/player-status/player-status.component';



@NgModule({
  declarations: [
    PlayerStatusComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlayerStatusComponent
  ]
})
export class PlayerModule { }
