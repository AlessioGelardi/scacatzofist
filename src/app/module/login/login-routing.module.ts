import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckComponent } from '../deck/component/deck/deck.component';
import { LoginComponent } from './component/login/login.component';
import { RecoverComponent } from './component/recover/recover.component';
import { SigninComponent } from './component/signin/signin.component';

const loginRoutes: Routes = [
  { path: '', component: DeckComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'recover', component: RecoverComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
