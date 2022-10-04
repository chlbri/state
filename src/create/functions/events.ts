import { z } from 'zod';
import { EventObject, NOmit, Transition } from '../types';

export function createEvents<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  schema: z.ZodType<
    NOmit<Transition<TC, TE, PTC>, 'event'>[],
    z.ZodTypeDef,
    any
  >,
) {
  const mapper = (
    object?: Record<string, NOmit<Transition, 'event'>[]>,
  ) => {
    const out: Transition<TC, TE, PTC>[] = [];
    if (!object) return out;
    Object.entries(object).forEach(([event, transitions]) => {
      transitions.forEach(transition =>
        out.push({
          ...transition,
          event,
        }),
      );
    });

    return out;
  };

  return z.record(schema).optional().transform(mapper);
}
