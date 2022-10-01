import { NExtract } from '@bemedev/core';
import { ServicePromise_JSON, Subscribable_JSON } from './Service';
import { TransitionExtend } from './Transition';
import { TransitionMap_JSON } from './TransitionConfig';
import { DefaultTypes, SingleOrArray } from './_default';

export type DefaultNodeType = DefaultTypes['node'];

type JSONTypes = DefaultTypes['node']['types']['array'][number];
type TyE<K extends JSONTypes> = NExtract<JSONTypes, K>;

export type ParallelNode = {
  parentId?: string;
  id?: string;
  description?: string;
  type: TyE<'parallel'>;
  initial?: undefined;
  children: Record<string, Node>;
  delimiter?: string;
  promises?: SingleOrArray<ServicePromise_JSON>;
  subscribables?: SingleOrArray<Subscribable_JSON>;
  events?: TransitionMap_JSON;
  now?: SingleOrArray<TransitionExtend>;
  after?: SingleOrArray<TransitionExtend>;
};

export type CompoundNode = {
  parentId?: string;
  id?: string;
  description?: string;
  type?: TyE<'compound'>;
  initial: string;
  children: Record<string, Node>;
  delimiter?: string;
  promises?: SingleOrArray<ServicePromise_JSON>;
  subscribables?: SingleOrArray<Subscribable_JSON>;
  events?: TransitionMap_JSON;
  now?: SingleOrArray<TransitionExtend>;
  after?: SingleOrArray<TransitionExtend>;
};

export type AtomicNode = {
  parentId?: string;
  id?: string;
  description?: string;
  type?: TyE<'atomic'>;
  initial?: undefined;
  children?: undefined;
  delimiter?: string;
  promises?: SingleOrArray<ServicePromise_JSON>;
  subscribables?: SingleOrArray<Subscribable_JSON>;
  events?: TransitionMap_JSON;
  now?: SingleOrArray<TransitionExtend>;
  after?: SingleOrArray<TransitionExtend>;
};

export type Node = ParallelNode | CompoundNode | AtomicNode;
