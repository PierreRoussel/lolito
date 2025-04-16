import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDiffuclty',
})
export class DiffucltyPipe implements PipeTransform {
  transform(
    value: 'beginner' | 'intermediate' | 'advanced' | string,
    ...args: unknown[]
  ): unknown {
    const result = value === 'beginner' ? 'Débutant' : 'Intermédiaire';
    return value === 'advanced' ? 'Elite' : result;
  }
}
