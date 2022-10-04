import z from 'zod';
import { Tarray, ZodTarray } from '../create/types';

export function createZodStringLiterals<T extends z.Primitive>(
  ...values: Tarray<T>
) {
  return z.union(values.map(value => z.literal(value)) as ZodTarray<T>);
}

export function childrenIdsIncludeInitial(data: any) {
  const initial = data.initial;
  const ids = Object.keys(data.children);
  return ids.includes(initial);
}

export const objectIsNotEmpty = (data: object) => {
  const keys = Object.keys(data);
  return keys.length > 1;
};
