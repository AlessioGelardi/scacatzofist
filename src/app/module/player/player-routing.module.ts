import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { PlayerDetailComponent } from './component/player-detail/player-detail.component';
import { HoruseyeComponent } from './component/horuseye/horuseye.component';

export const playerRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'playerdetail', component: PlayerDetailComponent},
  { path: 'horuseye', component: HoruseyeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(playerRoutes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
