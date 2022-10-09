import type { NExtract, NOmit } from '@bemedev/core';
import { EventObject } from './event';
import { BaseType, DefaultTypes } from './_default';

export type Out<TC extends object, PTC extends object> = {
  context?: TC;
  privateContext?: PTC;
  target?: string;
};

export interface Duration<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> extends BaseType {
  libraryType: DefaultTypes['duration'];
  src: string;
  exec?: ActionDelay<TC, TE, PTC>;
}

export type ActionDelay<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = FunctionEvent<TC, TE, PTC, number>;

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = FunctionEvent<TC, TE, PTC, Out<TC, PTC>>;

export interface Action<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  src: string;
  libraryType: DefaultTypes['action'];
  exec?: ActionFunction<TC, TE, PTC>;
}

export type GuardPredicate<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = (props?: Props<TC, TE, PTC>) => boolean;

export interface Guard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  libraryType: DefaultTypes['guard'];
  src: string;
  predicate?: GuardPredicate<TC, TE, PTC>;
}

export interface Action<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  src: string;
  libraryType: DefaultTypes['action'];
  exec?: ActionFunction<TC, TE, PTC>;
}

export type Props<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  context?: TC;
  event?: TE;
  privateContext?: PTC;
};

export type Transition = {
  description?: string | undefined;
  event?: string | undefined;
  target?: string | undefined;
  in: string[];
  actions: string[];
  guards: string[];
  delay?: string | number;
};

export type ServiceType = DefaultTypes['service']['array'][number];

export interface Observer<T> {
  next: (value: T) => void;
  error?: (err: unknown) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<T = any> {
  subscribe(observer: Observer<T>): Subscription;
}

export interface ServicePromise<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  R = any,
> extends BaseType {
  libraryType: NExtract<ServiceType, 'state_manager.service.promise'>;
  src: string;
  timeout?: number | string;
  exec?: AsyncFunctionEvent<TC, TE, PTC, R>;
  then: Transition[];
  catch: Transition[];
  finally: string[];
}

export interface ServiceSubscribable<TE extends EventObject = EventObject>
  extends BaseType {
  libraryType: NExtract<ServiceType, 'state_manager.service.subscribable'>;
  src: string;
  exec?: Subscribable<TE>;
  error: Transition[];
  next: string[];
  complete: string[];
}

export type FunctionEvent<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  R = any,
> = (props?: Props<TC, TE, PTC>) => R;

export type AsyncFunctionEvent<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  R = any,
> = FunctionEvent<TC, TE, PTC, Promise<R>>;

export type Interval = {
  actions: string[];
  interval: string | number;
  delay?: string | number;
  guards: string[];
};

export type NodeOutput<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  parentID?: string;
  type: DefaultTypes['node']['types']['array'][number];
  id: string;
  description?: string;
  promises: NOmit<ServicePromise<TC, TE, PTC>, 'exec'>[];
  subscribables: NOmit<ServiceSubscribable<TE>, 'exec'>[];
  events: Transition[];
  intervals: Interval[];
  now: Transition[];
  after: Transition[];
  initial?: string;
  children?: Record<
    string,
    NOmit<NodeOutput<TC, TE, PTC>, 'id'> & { id?: string }
  >;
};

export type NodeWithChildren<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = NodeOutput<TC, TE, PTC> &
  Required<Pick<NodeOutput<TC, TE, PTC>, 'children'>>;
