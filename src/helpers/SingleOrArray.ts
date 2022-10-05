import { SingleOrArray } from '../types';

export function isArray<T>(
  value: SingleOrArray<T>,
): value is Exclude<T, undefined>[] {
  return !!value && Array.isArray(value);
}

export function isStringArray(value: any): value is string[] {
  return isArray(value) && value.every(str => typeof str === 'string');
}

export function isSingle<T>(
  value: SingleOrArray<T>,
): value is Exclude<T, undefined> {
  return !!value && !Array.isArray(value);
}
