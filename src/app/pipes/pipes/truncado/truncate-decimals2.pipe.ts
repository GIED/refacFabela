import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateDecimals2'
})
export class TruncateDecimals2Pipe implements PipeTransform {

  transform(value: number): number {
    if (value != null) {
      const stringValue = value.toString();
      const parts = stringValue.split('.');
      if (parts.length > 1) {
        const truncatedDecimal = parts[1].substring(0, 2);
        return parseFloat(parts[0] + '.' + truncatedDecimal);
      }
    }
    return value;
  }

}
