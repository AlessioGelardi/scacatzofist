import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './component/home/home.component';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerStatusComponent } from './component/player-status/player-status.component';



@NgModule({
  declarations: [
    HomeComponent,
    PlayerStatusComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule
  ]
})
export class PlayerModule { }
