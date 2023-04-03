import { Pipe, PipeTransform } from '@angular/core';
import { Card } from 'src/app/module/interface/card';

@Pipe({
  name: 'filterZainoOld'
})
export class FilterZainoPipe implements PipeTransform {

  transform(value: Card[], name: string): Card[] {
    let result: Card[] = value;
    if(name) {
      result = value.filter(card => card.name.toUpperCase().includes(name.toUpperCase()));
    }
    return result; 
  }

}
