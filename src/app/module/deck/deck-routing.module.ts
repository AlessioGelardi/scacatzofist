import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckComponent } from 'src/app/deck/deck.component';
import { DeckDetailComponent } from './component/deck-detail/deck-detail.component';
import { DeckEditComponent } from './component/deck-edit/deck-edit.component';

const deckRoutes: Routes = [
  { path: 'deck', component: DeckComponent },
  { path: 'deckDetail', component: DeckDetailComponent},
  { path: 'deckEdit', component: DeckEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(deckRoutes)],
  exports: [RouterModule]
})
export class DeckRoutingModule { }
