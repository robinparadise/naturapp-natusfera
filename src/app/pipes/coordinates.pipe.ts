import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coordinates'
})
export class CoordinatesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value? `${value.latitude}, ${value.longitude}` : '';
  }

}
