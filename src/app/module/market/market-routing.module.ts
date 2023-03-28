import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketComponent } from './component/market/market.component';

export const marketRoutes: Routes = [
  { path: 'marketplace', component: MarketComponent }
];

@NgModule({
  imports: [RouterModule.forChild(marketRoutes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
