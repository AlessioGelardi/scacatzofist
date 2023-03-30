import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { deckRoutes, DeckRoutingModule } from './module/deck/deck-routing.module';
import { loginRoutes, LoginRoutingModule } from './module/login/login-routing.module';
import { NotifierComponent } from './notifier/notifier.component';
import { PlaynowComponent } from './playnow/playnow.component';

const routes: Routes = [
  ...loginRoutes,
  ...deckRoutes,
  { path: 'home', component: HomeComponent },
  { path: 'marketplace', component: MarketplaceComponent},
  { path: 'playnow', component: PlaynowComponent},
  { path: 'notifier', component: NotifierComponent}
];

@NgModule({
  imports: [
    LoginRoutingModule,
    DeckRoutingModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
