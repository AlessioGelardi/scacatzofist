import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './module/player/component/home/home.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { deckRoutes, DeckRoutingModule } from './module/deck/deck-routing.module';
import { loginRoutes, LoginRoutingModule } from './module/login/login-routing.module';
import { marketRoutes, MarketRoutingModule } from './module/market/market-routing.module';
import { NotifierComponent } from './notifier/notifier.component';
import { PlaynowComponent } from './playnow/playnow.component';
import { playerRoutes, PlayerRoutingModule } from './module/player/player-routing.module';

const routes: Routes = [
  ...loginRoutes,
  ...playerRoutes,
  ...deckRoutes,
  ...marketRoutes,
  { path: 'home', component: HomeComponent },
  { path: 'marketplace', component: MarketplaceComponent},
  { path: 'playnow', component: PlaynowComponent},
  { path: 'notifier', component: NotifierComponent}
];

@NgModule({
  imports: [
    LoginRoutingModule,
    DeckRoutingModule,
    MarketRoutingModule,
    PlayerRoutingModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
