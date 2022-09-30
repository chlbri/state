import z from 'zod';
import { transitionSchema } from './Transtions';

export const transitionConfigEventSchema = z.record(
  z.union([transitionSchema, z.array(transitionSchema)]),
);

export const transitionConfigNowSchema = z.union([
  transitionSchema,
  z.array(transitionSchema),
]);

export const transitionConfigAfterSchema = z.union([
  transitionSchema,
  z.array(transitionSchema),
]);

export const transitionConfigSchema = z.union([
  transitionConfigEventSchema,
  transitionConfigAfterSchema,
  transitionConfigNowSchema,
]);
