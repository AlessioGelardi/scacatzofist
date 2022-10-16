import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckeditComponent } from './deckedit/deckedit.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path:'home', component: LoginComponent},
  { path:'home', component: HomeComponent},
  { path:'', component: DeckeditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
