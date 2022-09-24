import { DEFAULT_TYPES } from '../constants/objects';

export interface BaseType {
  description?: string;
  type: string;
}

export type SingleOrArray<T> = T[] | T;

export type DefaultTypes = typeof DEFAULT_TYPES;
