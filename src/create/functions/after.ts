import { z } from 'zod';
import { Definitions, EventObject, Transition } from '../types';
import { createDelay } from './delay';

export function createAfter<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  schema: z.ZodType<Transition<TC, TE, PTC>[], z.ZodTypeDef, any>,
  definitions?: Definitions<TC, TE, PTC>,
) {
  const mapper = (object?: Record<string | number, Transition[]>) => {
    const out: Transition<TC, TE, PTC>[] = [];

    if (!object) return out;
    Object.entries(object).forEach(([_delay, transitions]) => {
      const delay = createDelay(_delay, definitions);

      transitions.forEach(transition => {
        out.push({
          ...transition,
          delay,
        });
      });
    });

    return out;
  };

  return z
    .record(z.union([z.number(), z.string()]), schema)
    .optional()
    .transform(mapper);
}
