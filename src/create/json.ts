import { NExclude, NExtract } from '@bemedev/core';
import { Extend, NodeTypes, SingleOrArray } from './default';

type TyE<K extends NodeTypes = NodeTypes> = NExtract<NodeTypes, K>;

export type Action_JSON = {
  id: string;
  description?: string;
};

export type Guard_JSON = { id: string; description?: string };

export type GuardUnion =
  | GuardsOr_JSON
  | GuardsAnd_JSON
  | Guard_JSON
  | string;

export type GuardsOr_JSON = {
  or: GuardUnion[];
};

export type GuardsAnd_JSON = {
  and: GuardUnion[];
};

export type Guards_JSON = GuardUnion[] | GuardUnion;

export type Transition_JSON = {
  description?: string | undefined;
  target?: string | undefined;
  in?: SingleOrArray<string>;
  actions?: Extend<Action_JSON>;
  guards?: SingleOrArray<GuardUnion>;
};

export type ServicePromise_JSON = {
  timeout: number;
  description?: string;
  then: Extend<Transition_JSON>;
  catch: Extend<Transition_JSON>;
  finally?: Extend<Action_JSON>;
};

export type Subscribable_JSON = {
  description?: string;
  complete?: Extend<Action_JSON>;
  next?: Extend<Action_JSON>;
  error: Extend<Transition_JSON>;
};

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

const node: Node_JSON = {
  type: 'parallel',
  children: {},
  promises: {},
  // initial: '',
};

export type Config_JSON<
  TC extends object = object,
  PTC extends object = object,
> = {
  context: TC;
  privateContext?: PTC;
  delimiter?: string;
} & NExclude<Node_JSON, AtomicNode_JSON>;
