import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayNowComponent } from './component/play-now/play-now.component';
import { PlayNowScontroComponent } from './component/play-now-scontro/play-now-scontro.component';

export const playNowRoutes: Routes = [
  { path: '', component: PlayNowComponent },
  { path: 'scontro', component: PlayNowScontroComponent }
];

@NgModule({
  imports: [RouterModule.forChild(playNowRoutes)],
  exports: [RouterModule]
})
export class PlayNowRoutingModule { }
