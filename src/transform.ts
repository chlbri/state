import { z } from 'zod';

export function transform(config: any) {
  z.object({
    _id: z.string(),
    id: z.string().optional(),
    description: z.string().optional(),
    delimiter: z.string().optional(),
    promises: z.record(z.object({})).optional(),
    subscribables: z.record(z.object({})).optional(),
    events: z.record(z.object({})).optional(),
    now: z.record(z.object({})).optional(),
    after: z.record(z.object({})).optional(),
  });
}
