import type { ZodType } from 'zod';
import z from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import { DEFAULT_STATE_DELIMITER } from '../../constants/strings';
import type { Literals, Strings } from '../../Entities';
import type { NodeJSON } from '../../Entities/Node';
import { promiseJsonSchema, subscribableJsonSchema } from './Services';
import { baseSchema } from './_default';

function createZodStringLiterals<T extends Strings>(...values: T) {
  return z.union(values.map(value => z.literal(value)) as Literals);
}

export function childrenIdsIncludeInitial(data: any) {
  const initial = data.initial;
  const ids = Object.keys(data.children);
  return ids.includes(initial);
}

const objectIsNotEmpty = (data: object) => {
  const keys = Object.keys(data);
  return keys.length > 1;
};

const nodeCommonSchema = baseSchema
  .omit({ libraryType: true })
  .extend({
    parentId: z.string().optional(),
    id: z.string().optional(),
    delimiter: z.string().default(DEFAULT_STATE_DELIMITER).optional(),
    type: createZodStringLiterals(...DEFAULT_TYPES.node.types.array),
    initial: z.string().optional(),
    promises: z
      .union([promiseJsonSchema, z.array(promiseJsonSchema)])
      .optional(),
    subscribables: z
      .union([subscribableJsonSchema, z.array(subscribableJsonSchema)])
      .optional(),
  })
  .strict();

export const nodeSchema: ZodType<NodeJSON> = z.lazy(() =>
  z.union([parallelNodeSchema, compoundNodeSchema, atomicNodeSchema]),
);

const childrenSchema = z
  .record(nodeSchema)
  .refine(objectIsNotEmpty, { message: 'Children must be superior to 2' });

export const parallelNodeSchema = nodeCommonSchema.extend({
  type: z.literal(DEFAULT_TYPES.node.types.object.parallel),
  initial: z.undefined().optional(),
  children: childrenSchema,
});

export const compoundNodeSchemaError = {
  message: 'Initial must be one child',
};

export const compoundNodeSchema = nodeCommonSchema
  .extend({
    type: z.literal(DEFAULT_TYPES.node.types.object.compound).optional(),
    initial: z.string(),
    children: childrenSchema,
  })
  .refine(childrenIdsIncludeInitial, compoundNodeSchemaError);

export const atomicNodeSchema = nodeCommonSchema.extend({
  type: z.literal(DEFAULT_TYPES.node.types.object.atomic).optional(),
  initial: z.undefined().optional(),
  promise: z.undefined().optional(),
  subscribable: z.undefined().optional(),
  children: z.undefined().optional(),
});

// TODO : Define all error
