import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../interface/player';

@Pipe({
  name: 'filterPlayer'
})
export class FilterPlayerPipe implements PipeTransform {

  transform(value: Player[], name: string): Player[] {
    let result: Player[] = value;
    if(name) {
      result = value.filter(player => player.name.toUpperCase().includes(name.toUpperCase()));
    }
    return result; 
  }

}
