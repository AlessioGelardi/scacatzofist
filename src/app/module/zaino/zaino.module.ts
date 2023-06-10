import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './directives/autofocus.directive';
import { FilterZainoPipe } from './pipes/filter-zaino.pipe';
import { FilterCardComponent } from './component/filter-card/filter-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewCardComponent } from './component/view-card/view-card.component';
import { PlayerModule } from '../player/player.module';



@NgModule({
  declarations: [
    AutofocusDirective,
    FilterZainoPipe,
    FilterCardComponent,
    ViewCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlayerModule,
    ReactiveFormsModule
  ],
  exports: [
    AutofocusDirective,
    FilterZainoPipe,
    FilterCardComponent
  ],
})
export class ZainoModule { }
