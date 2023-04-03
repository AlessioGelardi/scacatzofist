import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofocusDirective } from './directives/autofocus.directive';
import { FilterZainoPipe } from './pipes/filter-zaino.pipe';



@NgModule({
  declarations: [
    AutofocusDirective,
    FilterZainoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AutofocusDirective,
    FilterZainoPipe
  ],
})
export class ZainoModule { }
