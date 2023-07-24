import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';
import { TradeNewComponent } from './components/trade-new/trade-new.component';
import { TradeDetailComponent } from './components/trade-detail/trade-detail.component';

export const tradeRoutes: Routes = [
  { path: 'trade', component: TradeComponent },
  { path: 'trade-new', component: TradeNewComponent },
  { path: 'trade-detail', component: TradeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(tradeRoutes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
