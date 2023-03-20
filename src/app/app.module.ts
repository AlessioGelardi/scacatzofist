import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { DeckComponent } from './deck/deck.component';
import { DeckEditComponent } from './deck/edit/edit.component';
import { DeckDetailComponent } from './deck/detail/detail.component';
import { DeckListComponent } from './deck/edit/list/list.component';
import { DeckButtonComponent } from './deck/button/button.component';
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
import { AutofocusDirective } from './autofocus.directive';
import { PlaynowComponent } from './playnow/playnow.component';
import { PlaynowButtonComponent } from './playnow/button/button.component';
import { PlaynowScontroComponent } from './playnow/scontro/scontro.component';
import { NotifierComponent } from './notifier/notifier.component';
import { FortuneWheelComponent } from './fortune-wheel/fortune-wheel.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DeckComponent,
    DeckEditComponent,
    DeckDetailComponent,
    DeckListComponent,
    DeckButtonComponent,
    FilterZainoPipe,
    PlayerStatusComponent,
    MarketplaceComponent,
    MarketplaceButtonComponent,
    MarketPlaceVenditaComponent,
    MarketPlaceEdicolaComponent,
    MarketPlaceViewpackComponent,
    MarketPlaceOpeningpackComponent,
    AutofocusDirective,
    PlaynowComponent,
    PlaynowButtonComponent,
    PlaynowScontroComponent,
    NotifierComponent,
    FortuneWheelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
