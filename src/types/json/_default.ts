import z from 'zod';
import { toArray } from '../../helpers';

export const JSONschema = z
  .object({
    src: z.string(),
    description: z.string().optional(),
  })
  .strict();

export const unionStringArray = z.union([
  z.string().optional().transform(toArray),
  z.array(z.string()),
]);
