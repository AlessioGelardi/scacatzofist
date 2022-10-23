import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterZaino'
})
export class MarketPlaceFilterZainoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
