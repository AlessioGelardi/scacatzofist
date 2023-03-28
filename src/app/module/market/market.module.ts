import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './component/market/market.component';
import { MarketRoutingModule } from './market-routing.module';



@NgModule({
  declarations: [
    MarketComponent
  ],
  imports: [
    CommonModule,
    MarketRoutingModule
  ]
})
export class MarketModule { }
