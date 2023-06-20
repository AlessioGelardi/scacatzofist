import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayNowComponent } from './component/play-now/play-now.component';
import { PlayerModule } from '../player/player.module';
import { PlayNowButtonsComponent } from './component/play-now-buttons/play-now-buttons.component';
import { PlayNowScontroComponent } from './component/play-now-scontro/play-now-scontro.component';
import { PlayNowTrainingComponent } from './component/play-now-training/play-now-training.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPlayerPipe } from './pipe/filter-player.pipe';
import { PlayNowPuntataComponent } from './component/play-now-puntata/play-now-puntata.component';
import { PlayNowPlayersComponent } from './component/play-now-players/play-now-players.component';



@NgModule({
  declarations: [
    PlayNowComponent,
    PlayNowButtonsComponent,
    PlayNowScontroComponent,
    PlayNowTrainingComponent,
    FilterPlayerPipe,
    PlayNowPuntataComponent,
    PlayNowPlayersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlayerModule
  ]
})
export class PlayNowModule { }
