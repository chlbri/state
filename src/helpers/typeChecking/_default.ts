import { z } from 'zod';

export const baseSchema = z.object({
  libraryType: z.string(),
  description: z.string().optional(),
});
