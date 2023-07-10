import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatusComponent } from './component/player-status/player-status.component';
import { HomeComponent } from './component/home/home.component';
import { PlayerDetailComponent } from './component/player-detail/player-detail.component';
import { PlayerButtonsComponent } from './component/player-buttons/player-buttons.component';



@NgModule({
  declarations: [
    HomeComponent,
    PlayerStatusComponent,
    PlayerDetailComponent,
    PlayerButtonsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlayerStatusComponent
  ]
})
export class PlayerModule { }
