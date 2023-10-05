import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: any, format: string = 'dd/MM/yyyy HH:mm:ss', timezone: string = 'UTC'): any {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(value, format, timezone);
    return formattedDate;
  }
}