import { NUMBERS } from '@-constants';
import { Transition } from '@-types';
import { z } from 'zod';

function mapper(object?: Record<string | number, Transition[]>) {
  const out: Transition[] = [];
  if (!object) return out;

  Object.entries(object).forEach(([delay, transitions]) => {
    transitions.forEach(transition => {
      out.push({
        ...transition,
        delay,
      });
    });
  });

  return out;
}

export function createAfter(
  schema: z.ZodType<Transition[], z.ZodTypeDef, any>,
  delaySchema: z.ZodUnion<
    [z.ZodNumber, z.ZodEffects<z.ZodString, string, string>]
  >,
) {
  return z
    .record(
      delaySchema.refine(value => {
        if (typeof value === 'number')
          return value > 0 && value <= NUMBERS.MAXIMUM_DELAY;
        return true;
      }),
      schema,
    )
    .optional()
    .transform(mapper);
}
