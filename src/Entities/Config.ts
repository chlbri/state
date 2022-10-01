import { NExclude } from '@bemedev/core';
import { AtomicNode, Node } from './Node';

export type Config<
  TC extends object = object,
  PTC extends object = object,
> = {
  context: TC;
  privateCOntext: PTC;
} & NExclude<Node, AtomicNode>;
