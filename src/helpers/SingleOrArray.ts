import { SingleOrArray } from '../Entities';

export function isArray<T>(
  value: SingleOrArray<T>,
): value is Exclude<T, undefined>[] {
  return !!value && Array.isArray(value);
}

export function isSingle<T>(
  value: SingleOrArray<T>,
): value is Exclude<T, undefined> {
  return !!value && !Array.isArray(value);
}
