import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { deckRoutes, DeckRoutingModule } from './module/deck/deck-routing.module';
import { loginRoutes, LoginRoutingModule } from './module/login/login-routing.module';
import { marketRoutes, MarketRoutingModule } from './module/market/market-routing.module';
import { playerRoutes, PlayerRoutingModule } from './module/player/player-routing.module';
import { PlayNowRoutingModule, playNowRoutes } from './module/play-now/market-routing.module';
import { notifierRoutes } from './module/notifier/notifier-routing.module';
import { NotifierModule } from './module/notifier/notifier.module';

const routes: Routes = [
  ...loginRoutes,
  ...playerRoutes,
  ...deckRoutes,
  ...marketRoutes,
  ...playNowRoutes,
  ...notifierRoutes
];

@NgModule({
  imports: [
    LoginRoutingModule,
    DeckRoutingModule,
    MarketRoutingModule,
    PlayerRoutingModule,
    PlayNowRoutingModule,
    NotifierModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
