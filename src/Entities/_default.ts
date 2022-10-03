import z from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';

export interface BaseType {
  description?: string;
  libraryType: string;
}

export const JSONschema = z
  .object({
    id: z.string(),
    description: z.string().optional(),
  })
  .strict();

export type SingleOrArray<T> = T[] | T;

export type DefaultTypes = typeof DEFAULT_TYPES;

export type WithString<T> = string | T;
