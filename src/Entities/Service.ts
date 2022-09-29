import { NExtract, NOmit } from '@bemedev/core';
import { Action_JSON } from './Action';
import type { EventObject } from './Event';
import { AsyncFunctionEvent } from './Function';
import type { Transition, TransitionExtend } from './Transition';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

type Types = 'promise' | 'subscribable';
export type ServiceType = `${DefaultTypes['service']}.${Types}`;

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
  id: string;
  timeout: number;
  exec: AsyncFunctionEvent<TC, TE, PTC>;
  then: Transition;
  catch: Transition;
  finally?: string[];
}

export function createPromise<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  props: NOmit<ServicePromise<TC, TE, PTC>, 'libraryType'>,
): ServicePromise<TC, TE, PTC> {
  return { ...props, libraryType: 'state_manager.service.promise' };
}

export type ServicePromise_JSON = {
  src: string;
  description?: string;
  then: SingleOrArray<TransitionExtend>;
  catch: SingleOrArray<TransitionExtend>;
  finally?: SingleOrArray<Action_JSON>;
};
