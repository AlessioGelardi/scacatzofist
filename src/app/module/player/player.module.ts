import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatusComponent } from './component/player-status/player-status.component';
import { HomeComponent } from './component/home/home.component';
import { PlayerDetailComponent } from './component/player-detail/player-detail.component';
import { PlayerButtonsComponent } from './component/player-buttons/player-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPlayerPipe } from './pipe/filter-player.pipe';



@NgModule({
  declarations: [
    HomeComponent,
    PlayerStatusComponent,
    PlayerDetailComponent,
    PlayerButtonsComponent,
    FilterPlayerPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PlayerStatusComponent,
    FilterPlayerPipe
  ]
})
export class PlayerModule { }
