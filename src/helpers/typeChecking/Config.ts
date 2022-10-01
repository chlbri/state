import z from 'zod';
import {
  childrenIdsIncludeInitial,
  compoundNodeSchema,
  compoundNodeSchemaError,
  parallelNodeSchema,
} from './Nodes';

function contexts<
  TC extends z.ZodRawShape = z.ZodRawShape,
  PTC extends z.ZodRawShape = z.ZodRawShape,
>(context: TC, privateContext: PTC) {
  return {
    context: z.object(context),
    privateContext: z.object(privateContext).optional(),
  };
}

export function configSchema<
  TC extends z.ZodRawShape = z.ZodRawShape,
  PTC extends z.ZodRawShape = z.ZodRawShape,
>(context: TC, privateContext: PTC) {
  const shape = contexts(context, privateContext);

  const union = z.union([
    parallelNodeSchema.extend(shape),
    compoundNodeSchema
      .innerType()
      .extend(shape)
      .refine(childrenIdsIncludeInitial, compoundNodeSchemaError),
  ]);

  return union;
}

// TODO : Add error for atomic
