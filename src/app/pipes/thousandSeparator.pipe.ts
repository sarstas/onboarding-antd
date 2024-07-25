import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator',
  standalone: true
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null) return '';

    let [integer, fraction = ''] = value.toString().split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fraction ? `${integer}.${fraction}` : integer;
  }

}
