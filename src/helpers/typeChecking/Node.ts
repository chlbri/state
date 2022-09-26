import type { ZodType } from 'zod';
import z from 'zod';
import type { Literals, Strings } from '../../types';
import type { NodeProps } from '../../types/Node';

function createZodStringLiterals<T extends Strings>(...values: T) {
  return z.union(values.map(value => z.literal(value)) as Literals);
}

const childrenIdsIncludeInitial = (data: any) => {
  const initial = data.initial;
  const ids = data.children.map((child: any) => child._id);
  return ids.includes(initial);
};

const nodeCommonSchema = z
  .object({
    parentId: z.string().optional(),
    _id: z.string(),
    id: z.string().startsWith('#').optional(),
    description: z.string().optional(),
    delimiter: z.string().optional(),
    type: createZodStringLiterals(
      'atomic',
      'compound',
      'parallel',
      'promise',
    ).optional(),
    initial: z.string().optional(),
    promise: z.any().optional(),
  })
  .strict();

export const nodeSchema: ZodType<NodeProps> = z.lazy(() =>
  z.union([parallelNodeSchema, compoundNodeSchema, atomicNodeSchema]),
);

export const parallelNodeSchema = nodeCommonSchema.extend({
  type: z.literal('parallel'),
  initial: z.undefined().optional(),
  promise: z.undefined().optional(),
  children: z.array(nodeSchema).nonempty(),
});

export const compoundNodeSchema = nodeCommonSchema
  .extend({
    type: z.literal('compound').optional(),
    initial: z.string(),
    promise: z.undefined().optional(),
    children: z.array(nodeSchema, {}).nonempty(),
  })
  .refine(childrenIdsIncludeInitial);

export const atomicNodeSchema = nodeCommonSchema.extend({
  type: z.literal('atomic').optional(),
  initial: z.undefined().optional(),
  promise: z.undefined().optional(),
  children: z.undefined().optional(),
});
