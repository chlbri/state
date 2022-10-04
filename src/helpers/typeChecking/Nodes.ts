import type { Primitive, ZodType } from 'zod';
import z from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import { DEFAULT_STATE_DELIMITER } from '../../constants/strings';
import { Node_JSON } from '../../create/types/json/node';
import type { Tarray } from '../../Entities';
import { ZodTarray } from './../../Entities/helpers';
import { promiseJsonSchema, subscribableJsonSchema } from './Services';
import {
  transitionConfigAfterSchema,
  transitionConfigEventSchema,
  transitionConfigNowSchema,
} from './TranstionsConfig';
import { baseSchema } from './_default';

function createZodStringLiterals<T extends Primitive>(
  ...values: Tarray<T>
) {
  return z.union(values.map(value => z.literal(value)) as ZodTarray<T>);
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

export const compoundNodeSchemaError = {
  message: 'Initial must be one child',
};

const nodeCommonSchema = baseSchema
  .omit({ libraryType: true })
  .extend({
    parentId: z.string().optional(),
    id: z.string().optional(),
    delimiter: z.string().default(DEFAULT_STATE_DELIMITER).optional(),
    type: createZodStringLiterals(...DEFAULT_TYPES.node.types.array),
    initial: z.string().optional(),
    promises: z.record(promiseJsonSchema).optional(),
    subscribables: z.record(subscribableJsonSchema).optional(),
    events: transitionConfigEventSchema.optional(),
    now: transitionConfigNowSchema.optional(),
    after: transitionConfigAfterSchema.optional(),
  })
  .strict();

export const nodeSchema: ZodType<Node_JSON> = z.lazy(() =>
  z.union([parallelNodeSchema, compoundNodeSchema, atomicNodeSchema]),
);

const childrenSchema = z
  .record(nodeSchema)
  .refine(objectIsNotEmpty, { message: 'Children must be superior to 2' });

export const parallelNodeSchema = nodeCommonSchema
  .extend({
    type: z.literal(DEFAULT_TYPES.node.types.object.parallel),
    initial: z.undefined().optional(),
    children: childrenSchema,
  })
  .strict();

export const compoundNodeSchema = nodeCommonSchema
  .extend({
    type: z.literal(DEFAULT_TYPES.node.types.object.compound).optional(),
    initial: z.string(),
    children: childrenSchema,
  })
  .strict()
  .refine(childrenIdsIncludeInitial, compoundNodeSchemaError);

export const atomicNodeSchema = nodeCommonSchema
  .extend({
    type: z.literal(DEFAULT_TYPES.node.types.object.atomic).optional(),
    initial: z.undefined().optional(),
    promise: z.undefined().optional(),
    subscribable: z.undefined().optional(),
    children: z.undefined().optional(),
  })
  .strict();

// TODO : Define all errors
