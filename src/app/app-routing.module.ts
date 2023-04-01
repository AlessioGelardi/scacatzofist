import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckComponent } from './deck/deck.component';
import { FortuneWheelComponent } from './fortune-wheel/fortune-wheel.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { NotifierComponent } from './notifier/notifier.component';
import { PlaynowComponent } from './playnow/playnow.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path:'home', component: HomeComponent},
  { path:'deckedit', component: DeckComponent },
  { path: 'marketplace', component: MarketplaceComponent},
  { path: 'playnow', component: PlaynowComponent},
  { path: 'notifier', component: NotifierComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
