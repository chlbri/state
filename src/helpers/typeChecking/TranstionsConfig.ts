import z from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import { transitionSchema } from './Transtions';
import { baseSchema } from './_default';

export const transitionConfigEventSchema = baseSchema.extend({
  libraryType: z.literal(DEFAULT_TYPES.transitionConfig.options.byEvent),
  eventType: z.string(),
  transitions: z.array(transitionSchema),
});

export const transitionConfigNowSchema = baseSchema.extend({
  libraryType: z.literal(DEFAULT_TYPES.transitionConfig.options.now),
  eventType: z.undefined().optional(),
  transitions: z.array(transitionSchema),
});

export const transitionConfigAfterSchema = baseSchema.extend({
  libraryType: z.literal(DEFAULT_TYPES.transitionConfig.options.after),
  eventType: z.undefined().optional(),
  transitions: z.array(transitionSchema),
});

export const transitionConfigSchema = z.discriminatedUnion('libraryType', [
  transitionConfigEventSchema,
  transitionConfigAfterSchema,
  transitionConfigNowSchema,
]);
