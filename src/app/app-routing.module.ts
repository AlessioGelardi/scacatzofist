import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { deckRoutes, DeckRoutingModule } from './module/deck/deck-routing.module';
import { loginRoutes, LoginRoutingModule } from './module/login/login-routing.module';
import { playerRoutes, PlayerRoutingModule } from './module/player/player-routing.module';
import { NotifierComponent } from './notifier/notifier.component';
import { PlaynowComponent } from './playnow/playnow.component';

const routes: Routes = [
  ...loginRoutes,
  ...playerRoutes,
  ...deckRoutes,
  { path: 'marketplace', component: MarketplaceComponent},
  { path: 'playnow', component: PlaynowComponent},
  { path: 'notifier', component: NotifierComponent}
];

@NgModule({
  imports: [
    LoginRoutingModule,
    DeckRoutingModule,
    PlayerRoutingModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
