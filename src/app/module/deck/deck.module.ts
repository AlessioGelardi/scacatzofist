import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckButtonsComponent } from './component/deck-buttons/deck-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeckComponent } from './component/deck/deck.component';
import { DeckRoutingModule } from './deck-routing.module';
import { DeckDetailComponent } from './component/deck-detail/deck-detail.component';
import { DeckEditComponent } from './component/deck-edit/deck-edit.component';
import { CardListComponent } from './component/deck-edit/card-list/card-list.component';
import { ZainoModule } from '../zaino/zaino.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    DeckComponent,
    DeckEditComponent,
    DeckDetailComponent,
    DeckButtonsComponent,
    CardListComponent
  ],
  imports: [
    BrowserAnimationsModule,
    DragDropModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeckRoutingModule,
    ZainoModule
  ]
})
export class DeckModule { }
