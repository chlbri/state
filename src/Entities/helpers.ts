import type { Primitive, ZodLiteral } from 'zod';

export type Strings = Tarray<string>;

export type Tarray<T extends Primitive> = readonly [T, T, ...T[]];
export type ZodTarray<T extends Primitive> = [
  ZodLiteral<T>,
  ZodLiteral<T>,
  ...ZodLiteral<T>[],
];
