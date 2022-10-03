import { NExtract } from '@bemedev/core';
import { ActionDelay } from './Action';
import { EventObject } from './Event';
import { ServicePromise_JSON, Subscribable_JSON } from './Service';
import { DefaultTypes, SingleOrArray } from './_default';

export type DefaultNodeType = DefaultTypes['node'];

type JSONTypes = DefaultTypes['node']['types']['array'][number];
type TyE<K extends JSONTypes> = NExtract<JSONTypes, K>;

export type Transition<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  description?: string | undefined;
  event?: string | undefined;
  target?: string | undefined;
  in: string[];
  actions: string[];
  guards: string[];
  delay?: ActionDelay<TC, TE, PTC>;
};

export type Extend<T> = string | T | (string | T)[];

type Common = {
  parentId?: string;
  id?: string;
  description?: string;

  promises?: Record<string, ServicePromise_JSON>;
  subscribables?: Record<string, Subscribable_JSON>;
  events?: Record<string, Extend<Transition>>;
  now?: SingleOrArray<Extend<Transition>>;
  after?: SingleOrArray<Extend<Transition>>;
};

export type ParallelNode = Common & {
  type: TyE<'parallel'>;
  initial?: undefined;
  children: Record<string, Node>;
};

export type CompoundNode = Common & {
  type?: TyE<'compound'>;
  initial: string;
  children: Record<string, Node>;
};

export type AtomicNode = Common & {
  type?: TyE<'atomic'>;
  initial?: undefined;
  children?: undefined;
};

export type Node = ParallelNode | CompoundNode | AtomicNode;
