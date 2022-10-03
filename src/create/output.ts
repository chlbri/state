import type { NExtract, NOmit } from '@bemedev/core';
import { BaseType, DefaultTypes, EventObject } from './default';

export type Out<TC extends object, PTC extends object> = {
  context?: TC;
  privateContext?: PTC;
  target?: string;
};

export type ActionDelay<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): number;
}['bivarianceHack'];

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
  id: string;
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

export type ServiceType = DefaultTypes['service']['array'][number];

export interface Observer<T> {
  next: (value: T) => void;
  error?: (err: unknown) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<T> {
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
  timeout: number;
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

export type Node<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  parentID?: string;
  type: string;
  id: string;
  description?: string;
  promises: ServicePromise<TC, TE, PTC>[];
  subscribables: ServiceSubscribable<TE>[];
  events: Transition<TC, TE, PTC>[];
  now: Transition<TC, TE, PTC>[];
  after: Transition<TC, TE, PTC>[];
  initial?: string;
  children?: Record<string, NOmit<Node<TC, TE, PTC>, 'id'>>;
};
