import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../../interface/card';

@Pipe({
  name: 'filterZaino'
})
export class FilterZainoPipe implements PipeTransform {

  transform(value: Card[], searchFilter: any): Card[] {
    let result: Card[] = value;
    if(searchFilter) {
      let x: Card[] = result;
      if(searchFilter.filter.etich) {
        x = value.filter(card => card.etich && card.etich["name"].toUpperCase() === searchFilter.filter.etich.toUpperCase());
      }

      if(searchFilter.filter.name) {
        x = x.filter(card => card.name.toUpperCase().includes(searchFilter.filter.name.toUpperCase()));
      }

      if(searchFilter.filter.category && typeof searchFilter.filter.type !=='string' && searchFilter.filter.type) {
        x = x.filter(card => searchFilter.filter.type.includes(card.type));
      }

      if(searchFilter.filter.attribute) {
        x = x.filter(card => searchFilter.filter.attribute===card.attribute);
      }

      if(searchFilter.filter.race) {
        x = x.filter(card => searchFilter.filter.race===card.race);
      }

      if(searchFilter.filter.atk>-50) {
        x = x.filter(card => searchFilter.filter.atk===card.atk);
      }

      if(searchFilter.filter.def>-50) {
        x = x.filter(card => searchFilter.filter.def===card.def);
      }

      if(searchFilter.filter.level>0) {
        x = x.filter(card => searchFilter.filter.level===card.level);
      }

      result = x;
      
    }
    return result; 
  }

}
