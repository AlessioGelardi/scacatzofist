import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatusComponent } from './component/player-status/player-status.component';
import { HomeComponent } from './component/home/home.component';
import { PlayerDetailComponent } from './component/player-detail/player-detail.component';
import { PlayerButtonsComponent } from './component/player-buttons/player-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPlayerPipe } from './pipe/filter-player.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HoruseyeComponent } from './component/horuseye/horuseye.component';


@NgModule({
  declarations: [
    HomeComponent,
    PlayerStatusComponent,
    PlayerDetailComponent,
    PlayerButtonsComponent,
    FilterPlayerPipe,
    HoruseyeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  exports: [
    PlayerStatusComponent,
    FilterPlayerPipe
  ]
})
export class PlayerModule { }
