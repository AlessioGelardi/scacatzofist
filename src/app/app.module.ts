import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginModule } from './module/login/login.module';
import { DeckModule } from './module/deck/deck.module';
import { MarketModule } from './module/market/market.module';
import { PlayerModule } from './module/player/player.module';
import { PlayNowModule } from './module/play-now/play-now.module';
import { NotifierModule } from './module/notifier/notifier.module';


@NgModule({
  declarations: [
    AppComponent
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
    NotifierModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
