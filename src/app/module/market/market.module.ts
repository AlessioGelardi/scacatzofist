import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './component/market/market.component';
import { MarketRoutingModule } from './market-routing.module';
import { MarketButtonsComponent } from './component/market-buttons/market-buttons.component';
import { MarketSellComponent } from './component/market-sell/market-sell.component';
import { MarketEdicolaComponent } from './component/market-edicola/market-edicola.component';
import { VetrinaComponent } from './component/market-edicola/vetrina/vetrina.component';
import { OpeningPackComponent } from './component/market-edicola/opening-pack/opening-pack.component';
import { PlayerModule } from '../player/player.module';
import { ZainoModule } from '../zaino/zaino.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MarketComponent,
    MarketButtonsComponent,
    MarketSellComponent,
    MarketEdicolaComponent,
    VetrinaComponent,
    OpeningPackComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MarketRoutingModule,
    PlayerModule,
    ZainoModule
  ]
})
export class MarketModule { }
