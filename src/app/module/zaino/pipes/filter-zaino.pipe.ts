import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../../interface/card';

@Pipe({
  name: 'filterZaino'
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
