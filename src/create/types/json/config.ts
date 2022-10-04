import { NExclude } from '@bemedev/core';
import { z } from 'zod';
import { AtomicNode_JSON, Node_JSON } from './node';

export const config_JSON = z.object({
  context: z.object({}),
  privateContext: z.object({}).optional(),
});

export type Config_JSON<
  TC extends object = object,
  PTC extends object = object,
> = {
  context: TC;
  privateContext?: PTC;
} & NExclude<Node_JSON, AtomicNode_JSON>;
