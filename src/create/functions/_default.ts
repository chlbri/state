import z from 'zod';
import { Action, Definitions, EventObject } from '../types';

export type CreateTransitionProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  remainActions: Action<TC, TE, PTC>[];
  actions: z.ZodType<string[], z.ZodTypeDef, any>;
  guards: z.ZodType<string[], z.ZodTypeDef, any>;
  definitions?: Definitions<TC, TE, PTC>;
};
