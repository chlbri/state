import { ERRORS } from '../constants';

export function getLastDefined<T>(...values: [...(T | undefined)[], T]) {
  const len = values.length - 1;
  const last = values[len];

  if (!last) throw ERRORS.LAST_ELEMENT_OF_ARRAY;

  for (const value of values.filter((_, id) => id !== len)) {
    if (value) return value;
  }
  return last;
}
