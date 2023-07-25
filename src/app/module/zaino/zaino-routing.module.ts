import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterCardComponent } from './component/filter-card/filter-card.component';
import { InventoryComponent } from './component/inventory/inventory.component';
import { YugiohdexComponent } from './component/yugiohdex/yugiohdex.component';

export const playNowRoutes: Routes = [
  { path: 'database', component: YugiohdexComponent },
  { path: 'inventory', component: InventoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(playNowRoutes)],
  exports: [RouterModule]
})
export class ZainoRoutingModule { }
