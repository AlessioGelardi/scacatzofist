import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './directives/autofocus.directive';
import { FilterZainoPipe } from './pipes/filter-zaino.pipe';
import { FilterCardComponent } from './component/filter-card/filter-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewCardComponent } from './component/view-card/view-card.component';
import { InventoryComponent } from './component/inventory/inventory.component';
import { OpeningPackComponent } from './component/inventory/opening-pack/opening-pack.component';
import { PlayerModule } from '../player/player.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { YugiohdexComponent } from './component/yugiohdex/yugiohdex.component';


@NgModule({
  declarations: [
    AutofocusDirective,
    FilterZainoPipe,
    FilterCardComponent,
    ViewCardComponent,
    OpeningPackComponent,
    InventoryComponent,
    YugiohdexComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    PlayerModule
  ],
  exports: [
    AutofocusDirective,
    FilterZainoPipe,
    FilterCardComponent,
    OpeningPackComponent,FilterCardComponent
  ],
})
export class ZainoModule { }
