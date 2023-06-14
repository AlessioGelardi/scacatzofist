import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { InventoryComponent } from './component/inventory/inventory.component';

export const playerRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'inventory', component: InventoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(playerRoutes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
