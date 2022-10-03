import { NExclude } from '@bemedev/core';
import { AtomicNode, Node } from './Node';

export type Config<
  TC extends object = object,
  PTC extends object = object,
> = {
  context: TC;
  privateContext: PTC;
  delimiter?: string;
} & NExclude<Node, AtomicNode>;
