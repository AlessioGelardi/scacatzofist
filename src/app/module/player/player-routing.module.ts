import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';

export const playerRoutes: Routes = [
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(playerRoutes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
