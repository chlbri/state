import { SingleOrArray } from '../types';

export function isArray<T>(value: SingleOrArray<T>): value is T[] {
  return Array.isArray(value);
}

export function isSingle<T>(value: SingleOrArray<T>): value is T {
  return !isArray(value);
}
