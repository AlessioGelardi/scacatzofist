import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckDetailComponent } from './component/deck-detail/deck-detail.component';
import { DeckEditComponent } from './component/deck-edit/deck-edit.component';
import { DeckComponent } from './component/deck/deck.component';

export const deckRoutes: Routes = [
  { path: 'deck', component: DeckComponent },
  { path: 'deckDetail', component: DeckDetailComponent},
  { path: 'deckEdit', component: DeckEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(deckRoutes)],
  exports: [RouterModule]
})
export class DeckRoutingModule { }
