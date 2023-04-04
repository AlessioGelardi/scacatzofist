import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RecoverComponent } from './component/recover/recover.component';
import { SigninComponent } from './component/signin/signin.component';

export const loginRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'recover', component: RecoverComponent}
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
  static loginRoutes: any;
}
