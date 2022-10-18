import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeComponent } from './home/home.component';
import { DeckeditComponent } from './deckedit/deckedit.component';
import { DeckComponent } from './deck/deck.component';
import { DeckButtonComponent } from './deck/button/button.component';
import { DeckEditComponent } from './deck/edit/edit.component';
import { DeckDetailComponent } from './deck/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DeckeditComponent,
    DeckComponent,
    DeckButtonComponent,
    DeckEditComponent,
    DeckDetailComponent
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
