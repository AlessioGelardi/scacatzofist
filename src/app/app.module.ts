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
import { MarketModule } from './module/market/market.module';
import { PlayerModule } from './module/player/player.module';
import { PlayNowModule } from './module/play-now/play-now.module';
import { NotifierModule } from './module/notifier/notifier.module';


@NgModule({
  declarations: [
    AppComponent,
    FilterZainoPipe,
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
    DeckModule,
    PlayerModule,
    MarketModule,
    PlayNowModule,
    NotifierModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
