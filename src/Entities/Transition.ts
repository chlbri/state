import { z } from 'zod';
import { actionJSONschema } from './Action';
import { guardsJSONschema } from './Guard';

/**
 * type <string> for target
 * type <string[]> for actions
 */

const inTransform = z.union([
  z.string().transform(data => [data]),
  z.array(z.string()).transform(data => data),
  z.undefined().transform(() => [] as string[]),
]);

const actionTransform = z.union([
  actionJSONschema.transform(value => [value.id]),
  z.string().transform(value => [value]),
  z.array(
    z.union([
      z.string().transform(value => value),
      actionJSONschema.transform(value => value.id),
    ]),
  ),
  z.undefined().transform(() => [] as string[]),
]);

export const transitionComplexSchema = z.object({
  description: z.string().optional(),
  guards: guardsJSONschema.optional(),
  in: inTransform.optional(),
  actions: actionTransform.optional(),
  target: z.string().optional(),
});

export const transitionSchema = z.union([
  transitionComplexSchema,
  z.string(),
  z.array(z.union([z.string(), transitionComplexSchema])),
]);

export const createTransition = z.union([
  transitionComplexSchema.transform(value => [
    { ...value, event: undefined as undefined | string },
  ]),
  z.string().transform(target => [{ target, actions: [], in: [] }]),
  z.array(
    z.union([
      z.string().transform(target => ({ target, actions: [], in: [] })),
      transitionComplexSchema.transform(value => ({
        ...value,
        event: undefined as undefined | string,
      })),
    ]),
  ),
]);
