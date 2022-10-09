import { OBJECTS, STRINGS } from '@-constants';
import {
  childrenIdsIncludeInitial,
  createZodStringLiterals,
  objectIsNotEmpty,
} from '@-helpers';
import { NOmit } from '@bemedev/core';
import { z } from 'zod';
import { EventObject, NodeOutput, Node_JSON } from '../../../types';

import { createAfter } from '../../after';
import { createEvents } from '../../events';
import { compoundNodeLengthError } from '../../node';
import type {
  IntervalProp,
  PromiseProp,
  SubscribableProp,
  TransitionProp,
} from './types';

type Props<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  transitionTransform: TransitionProp;
  promiseTransform: PromiseProp<TC, TE, PTC>;
  subscribableTransform: SubscribableProp<TE>;
  durationTransform: z.ZodUnion<
    [z.ZodNumber, z.ZodEffects<z.ZodString, string, string>]
  >;
  intervalTransform: IntervalProp;
};

export function createSchema<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  transitionTransform,
  promiseTransform,
  subscribableTransform,
  durationTransform,
  intervalTransform,
}: Props<TC, TE, PTC>) {
  const nodeSchema: z.ZodType<
    NOmit<NodeOutput<TC, TE, PTC>, 'id'>,
    z.ZodTypeDef,
    Node_JSON
  > = z.lazy(() =>
    z.union([parallelNodeSchema, compoundNodeSchema, atomicNodeSchema]),
  );

  const children = z.record(nodeSchema).refine(objectIsNotEmpty, {
    message: 'Children must be superior to 2',
  });

  const common = z
    .object({
      parentID: z.string().optional(),
      id: z.string().optional(),
      description: z.string().optional(),
      delimiter: z
        .string()
        .default(STRINGS.DEFAULT_STATE_DELIMITER)
        .optional(),
      events: createEvents(transitionTransform),
      type: createZodStringLiterals(
        ...OBJECTS.DEFAULT_TYPES.node.types.array,
      ).optional(),
      now: transitionTransform,
      after: createAfter(transitionTransform, durationTransform),
      promises: promiseTransform,
      subscribables: subscribableTransform,
      intervals: intervalTransform,
    })
    .strict();

  const parallelNodeSchema = common
    .extend({
      type: z.literal(OBJECTS.DEFAULT_TYPES.node.types.object.parallel),
      initial: z.undefined().optional(),
      children,
    })
    .strict();

  const compoundNodeSchema = common
    .extend({
      initial: z.string(),
      children,
      type: z
        .literal(OBJECTS.DEFAULT_TYPES.node.types.object.compound)
        .default(OBJECTS.DEFAULT_TYPES.node.types.object.compound),
    })
    .strict()
    .refine(childrenIdsIncludeInitial, compoundNodeLengthError);

  const atomicNodeSchema = common
    .extend({
      initial: z.undefined().optional(),
      children: z.undefined().optional(),
      type: z
        .literal(OBJECTS.DEFAULT_TYPES.node.types.object.atomic)
        .default(OBJECTS.DEFAULT_TYPES.node.types.object.atomic),
    })
    .strict();

  const out = z.union([compoundNodeSchema, parallelNodeSchema]);

  return out;
}
