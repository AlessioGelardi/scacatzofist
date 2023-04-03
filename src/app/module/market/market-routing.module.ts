import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketEdicolaComponent } from './component/market-edicola/market-edicola.component';
import { MarketSellComponent } from './component/market-sell/market-sell.component';
import { MarketComponent } from './component/market/market.component';

export const marketRoutes: Routes = [
  { path: 'market', component: MarketComponent },
  { path: 'sell', component: MarketSellComponent },
  { path: 'edicola', component: MarketEdicolaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(marketRoutes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
