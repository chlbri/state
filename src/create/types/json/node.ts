import { Extend, SingleOrArray } from '../_default';
import { ServicePromise_JSON, Subscribable_JSON } from './service';
import { Transition_JSON } from './transition';

type Common = {
  parentID?: string;
  id?: string;
  description?: string;
  promises?: Record<string, ServicePromise_JSON>;
  subscribables?: Record<string, Subscribable_JSON>;
  events?: Record<string, Extend<Transition_JSON>>;
  now?: SingleOrArray<Extend<Transition_JSON>>;
  after?: SingleOrArray<Extend<Transition_JSON>>;
};

export type ParallelNode_JSON = Common & {
  type: 'parallel';
  initial?: undefined;
  children: Record<string, Node_JSON>;
};

export type CompoundNode_JSON = Common & {
  type?: 'compound';
  initial: string;
  children: Record<string, Node_JSON>;
};

export type AtomicNode_JSON = Common & {
  type?: 'atomic';
  initial?: undefined;
  children?: undefined;
};

export type Node_JSON =
  | ParallelNode_JSON
  | CompoundNode_JSON
  | AtomicNode_JSON;
