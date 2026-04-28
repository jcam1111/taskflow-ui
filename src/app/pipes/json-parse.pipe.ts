import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonParse',
  standalone: true
})
export class JsonParsePipe implements PipeTransform {
  transform(value: string | undefined | null): any[] {
    if (!value) {
      return [];
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Error al parsear JSON en el pipe:', e);
      return [];
    }
  }
}