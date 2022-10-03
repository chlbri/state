import { z } from 'zod';

export const actionSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
});
