import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayNowComponent } from './component/play-now/play-now.component';
import { PlayNowScontroComponent } from './component/play-now-scontro/play-now-scontro.component';
import { PlayNowTrainingComponent } from './component/play-now-training/play-now-training.component';
import { PlayNowPuntataComponent } from './component/play-now-puntata/play-now-puntata.component';

export const playNowRoutes: Routes = [
  { path: 'playnow', component: PlayNowComponent },
  { path: 'scontro', component: PlayNowScontroComponent },
  { path: 'training', component: PlayNowTrainingComponent },
  { path: 'puntata', component: PlayNowPuntataComponent }
];

@NgModule({
  imports: [RouterModule.forChild(playNowRoutes)],
  exports: [RouterModule]
})
export class PlayNowRoutingModule { }
