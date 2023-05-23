import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayNowComponent } from './component/play-now/play-now.component';
import { PlayerModule } from '../player/player.module';
import { PlayNowButtonsComponent } from './component/play-now-buttons/play-now-buttons.component';
import { PlayNowScontroComponent } from './component/play-now-scontro/play-now-scontro.component';
import { PlayNowTrainingComponent } from './component/play-now-training/play-now-training.component';
import { FormsModule } from '@angular/forms';
import { FilterPlayerPipe } from './pipe/filter-player.pipe';



@NgModule({
  declarations: [
    PlayNowComponent,
    PlayNowButtonsComponent,
    PlayNowScontroComponent,
    PlayNowTrainingComponent,
    FilterPlayerPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlayerModule
  ]
})
export class PlayNowModule { }
