import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterCardComponent } from './component/filter-card/filter-card.component';

export const playNowRoutes: Routes = [
  { path: 'database', component: FilterCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(playNowRoutes)],
  exports: [RouterModule]
})
export class ZainoRoutingModule { }
