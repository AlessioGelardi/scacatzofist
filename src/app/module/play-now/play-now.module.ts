import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayNowComponent } from './component/play-now/play-now.component';
import { PlayerModule } from '../player/player.module';
import { PlayNowButtonsComponent } from './component/play-now-buttons/play-now-buttons.component';
import { PlayNowScontroComponent } from './component/play-now-scontro/play-now-scontro.component';



@NgModule({
  declarations: [
    PlayNowComponent,
    PlayNowButtonsComponent,
    PlayNowScontroComponent
  ],
  imports: [
    CommonModule,
    PlayerModule
  ]
})
export class PlayNowModule { }
