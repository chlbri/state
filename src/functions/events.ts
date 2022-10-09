import { NOmit, Transition } from '@-types';
import { z } from 'zod';

export function createEvents(
  schema: z.ZodType<NOmit<Transition, 'event'>[], z.ZodTypeDef, any>,
) {
  const mapper = (
    object?: Record<string, NOmit<Transition, 'event'>[]>,
  ) => {
    const out: Transition[] = [];
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
