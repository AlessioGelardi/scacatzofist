import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketEdicolaComponent } from './component/market-edicola/market-edicola.component';
import { MarketSellComponent } from './component/market-sell/market-sell.component';
import { MarketComponent } from './component/market/market.component';
import { MarketSkinComponent } from './component/market-skin/market-skin.component';

export const marketRoutes: Routes = [
  { path: 'market', component: MarketComponent },
  { path: 'sell', component: MarketSellComponent },
  { path: 'edicola', component: MarketEdicolaComponent },
  { path: 'skin', component: MarketSkinComponent }
];

@NgModule({
  imports: [RouterModule.forChild(marketRoutes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
