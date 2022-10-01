import { NExtract, NOmit } from '@bemedev/core';
import { Action_JSON } from './Action';
import type { EventObject } from './Event';
import { AsyncFunctionEvent } from './Function';
import type { Transition, TransitionExtend } from './Transition';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

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
> extends BaseType {
  libraryType: NExtract<ServiceType, 'state_manager.service.promise'>;
  src: string;
  timeout: number;
  exec?: AsyncFunctionEvent<TC, TE, PTC>;
  then: SingleOrArray<Transition>;
  catch: SingleOrArray<Transition>;
  finally?: SingleOrArray<WithString<Action_JSON>>;
}

export interface ServiceSubscribable<TE extends EventObject = EventObject>
  extends BaseType {
  libraryType: NExtract<ServiceType, 'state_manager.service.subscribable'>;
  src: string;
  exec?: Subscribable<TE>;
  error: SingleOrArray<Transition>;
  next?: SingleOrArray<WithString<Action_JSON>>;
  complete?: SingleOrArray<WithString<Action_JSON>>;
}

export function createServicePromise<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  props: NOmit<ServicePromise<TC, TE, PTC>, 'libraryType'>,
): ServicePromise<TC, TE, PTC> {
  return { ...props, libraryType: 'state_manager.service.promise' };
}

export function createServiceSubscribable<
  TE extends EventObject = EventObject,
>(
  props: NOmit<ServiceSubscribable<TE>, 'libraryType'>,
): ServiceSubscribable<TE> {
  return { ...props, libraryType: 'state_manager.service.subscribable' };
}

export type ServicePromise_JSON = {
  src: string;
  timeout: number;
  description?: string;
  then: SingleOrArray<TransitionExtend>;
  catch: SingleOrArray<TransitionExtend>;
  finally?: SingleOrArray<WithString<Action_JSON>>;
};

export type Subscribable_JSON = {
  src: string;
  description?: string;
  complete?: SingleOrArray<WithString<Action_JSON>>;
  next?: SingleOrArray<WithString<Action_JSON>>;
  error: SingleOrArray<TransitionExtend>;
};
