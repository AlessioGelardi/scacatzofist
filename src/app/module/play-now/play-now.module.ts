import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayNowComponent } from './component/play-now/play-now.component';
import { PlayerModule } from '../player/player.module';
import { PlayNowButtonsComponent } from './component/play-now-buttons/play-now-buttons.component';
import { PlayNowScontroComponent } from './component/play-now-scontro/play-now-scontro.component';
import { PlayNowTrainingComponent } from './component/play-now-training/play-now-training.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayNowPuntataComponent } from './component/play-now-puntata/play-now-puntata.component';
import { PlayNowPlayersComponent } from './component/play-now-players/play-now-players.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayNowTorneoComponent } from './component/play-now-torneo/play-now-torneo.component';
import { PlayNowDetailTorneoComponent } from './component/play-now-torneo/play-now-detail-torneo/play-now-detail-torneo.component';
import { ZainoModule } from '../zaino/zaino.module';



@NgModule({
  declarations: [
    PlayNowComponent,
    PlayNowButtonsComponent,
    PlayNowScontroComponent,
    PlayNowTrainingComponent,
    PlayNowPuntataComponent,
    PlayNowPlayersComponent,
    PlayNowTorneoComponent,
    PlayNowDetailTorneoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PlayerModule,
    ZainoModule
  ]
})
export class PlayNowModule { }
