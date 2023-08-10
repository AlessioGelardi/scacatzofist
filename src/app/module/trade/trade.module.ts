import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeRoutingModule } from './trade-routing.module';
import { TradeComponent } from './components/trade/trade.component';
import { PlayerModule } from '../player/player.module';
import { TradeButtonsComponent } from './components/trade-buttons/trade-buttons.component';
import { TradeNewComponent } from './components/trade-new/trade-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TradeDetailComponent } from './components/trade-detail/trade-detail.component';
import { ZainoModule } from '../zaino/zaino.module';
import { TradeNewDeckComponent } from './components/trade-new/trade-new-deck/trade-new-deck.component';
import { TradeNewCardComponent } from './components/trade-new/trade-new-card/trade-new-card.component';



@NgModule({
  declarations: [
    TradeComponent,
    TradeButtonsComponent,
    TradeNewComponent,
    TradeDetailComponent,
    TradeNewDeckComponent,
    TradeNewCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    TradeRoutingModule,
    PlayerModule,
    ZainoModule
  ]
})
export class TradeModule { }
