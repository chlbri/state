import z from 'zod';
import { actionSchema } from './Actions';
import { guardsJSONschema } from './Guards';

export const transitionTargetSchema = z.string();
export const transitionActionsSchema = z.array(z.string());

export const transitionComplexSchema = z.object({
  description: z.string().optional(),
  guards: guardsJSONschema.optional(),
  in: z.union([z.string(), z.array(z.string())]).optional(),
  actions: z.union([actionSchema, z.array(actionSchema)]),
  target: z.string().optional(),
});

export const transitionSchema = z.union([
  transitionTargetSchema,
  transitionActionsSchema,
  transitionComplexSchema,
]);
