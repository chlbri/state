import { z } from 'zod';

export const actionComplexSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
});
export const actionSimpleSchema = z.string();

export const actionSchema = z.union([
  actionSimpleSchema,
  actionComplexSchema,
]);
