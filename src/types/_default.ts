import type { Primitive, ZodLiteral } from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';

export type SingleOrArray<T> = T[] | T;
export type Extend<T> = SingleOrArray<string | T>;
export type DefaultTypes = typeof DEFAULT_TYPES;
export interface BaseType {
  description?: string;
  libraryType: string;
}

export type NodeTypes = DefaultTypes['node']['types']['array'][number];

export type NExtract<T, U extends T> = Extract<T, U>;
export type NExclude<T, U extends T> = Exclude<T, U>;
export type NOmit<T, K extends keyof T> = Omit<T, K>;

export type Strings = Tarray<string>;

export type Tarray<T extends Primitive> = readonly [T, T, ...T[]];
export type ZodTarray<T extends Primitive> = [
  ZodLiteral<T>,
  ZodLiteral<T>,
  ...ZodLiteral<T>[],
];
