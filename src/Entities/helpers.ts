import type { ZodLiteral } from 'zod';

export type Strings = readonly [string, string, ...string[]];
export type Literals = [
  ZodLiteral<string>,
  ZodLiteral<string>,
  ...ZodLiteral<string>[],
];
