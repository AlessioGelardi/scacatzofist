import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterZainoPipe } from './deck/edit/filter-zaino.pipe';

import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MarketplaceButtonComponent } from './marketplace/button/button.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeComponent } from './home/home.component';
import { PlayerStatusComponent } from './player-status/player-status.component';
import { MarketPlaceVenditaComponent } from './marketplace/vendita/vendita.component';
import { MarketPlaceEdicolaComponent } from './marketplace/edicola/edicola.component';
import { MarketPlaceViewpackComponent } from './marketplace/edicola/viewpack/viewpack.component';
import { MarketPlaceOpeningpackComponent } from './marketplace/edicola/openingpack/openingpack.component';
import { PlaynowComponent } from './playnow/playnow.component';
import { PlaynowButtonComponent } from './playnow/button/button.component';
import { PlaynowScontroComponent } from './playnow/scontro/scontro.component';
import { NotifierComponent } from './notifier/notifier.component';
import { LoginModule } from './module/login/login.module';
import { DeckModule } from './module/deck/deck.module';
import { PlayerModule } from './module/player/player.module';
import { MarketModule } from './module/market/market.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FilterZainoPipe,
    PlayerStatusComponent,
    MarketplaceComponent,
    MarketplaceButtonComponent,
    MarketPlaceVenditaComponent,
    MarketPlaceEdicolaComponent,
    MarketPlaceViewpackComponent,
    MarketPlaceOpeningpackComponent,
    PlaynowComponent,
    PlaynowButtonComponent,
    PlaynowScontroComponent,
    NotifierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    LoginModule,
    PlayerModule,
    DeckModule,
    MarketModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
