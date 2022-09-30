import { z } from 'zod';
import {
  childrenIdsIncludeInitial,
  compoundNodeSchema,
  compoundNodeSchemaError,
  parallelNodeSchema,
} from './Nodes';

export function configSchema<
  TC extends z.ZodRawShape = z.ZodRawShape,
  PTC extends z.ZodRawShape = z.ZodRawShape,
>(context: TC, privateContext: PTC) {
  return z.union([
    parallelNodeSchema.extend({
      context: z.object(context),
      privateContext: z.object(privateContext).optional(),
    }),
    compoundNodeSchema
      .innerType()
      .extend({
        context: z.object(context),
        privateContext: z.object(privateContext).optional(),
      })
      .refine(childrenIdsIncludeInitial, compoundNodeSchemaError),
  ]);
}

// TODO : Add error for atomic
