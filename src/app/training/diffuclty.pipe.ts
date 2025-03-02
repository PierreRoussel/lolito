import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDiffuclty',
})
export class DiffucltyPipe implements PipeTransform {
  transform(
    value: 'beginner' | 'intermediate' | 'advanced',
    ...args: unknown[]
  ): unknown {
    const result = value === 'beginner' ? 'Débutant' : 'Intermédiaire';
    console.log("🚀 ~ value === 'beginner':", value === 'beginner');
    console.log('🚀 ~ result:', result);
    console.log('value', value);
    return value === 'advanced' ? 'Avancé' : result;
  }
}
