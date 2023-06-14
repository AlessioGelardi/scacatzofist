import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatusComponent } from './component/player-status/player-status.component';
import { HomeComponent } from './component/home/home.component';
import { InventoryComponent } from './component/inventory/inventory.component';



@NgModule({
  declarations: [
    HomeComponent,
    PlayerStatusComponent,
    InventoryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlayerStatusComponent
  ]
})
export class PlayerModule { }
