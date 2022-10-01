import { z } from 'zod';
import { actionSchema } from './Actions';
import { transitionSchema } from './Transtions';
import { baseSchema } from './_default';

export const promiseJsonSchema = baseSchema
  .omit({ libraryType: true })
  .extend({
    src: z.string(),
    then: z.union([transitionSchema, z.array(transitionSchema)]),
    catch: z.union([transitionSchema, z.array(transitionSchema)]),
    finally: z.union([actionSchema, z.array(actionSchema)]).optional(),
    timeout: z.number(),
  });

export const subscribableJsonSchema = baseSchema
  .omit({ libraryType: true })
  .extend({
    src: z.string(),
    next: z.union([actionSchema, z.array(actionSchema)]).optional(),
    error: z.union([transitionSchema, z.array(transitionSchema)]),
    complete: z.union([actionSchema, z.array(actionSchema)]).optional(),
  });
