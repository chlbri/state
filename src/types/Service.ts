import type { NExtract, NOmit } from '@bemedev/core';
import { Action_JSON } from './Action';
import type { EventEmit, EventObject } from './Event';
import type { Props } from './Props';
import type { Transition_JSON } from './Transition';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

type Types = 'promise' | 'subscribable';
export type ServiceType = `${DefaultTypes['service']}.${Types}`;

type PromT = NExtract<ServiceType, 'state_manager.service.promise'>;
const promT: PromT = 'state_manager.service.promise';

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
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
  R = any,
> extends NOmit<BaseType, 'libraryType'> {
  id: string;
  timeout: number;
  exec: (props?: Props<TC, TE, PTC, PTE>) => Promise<R>;
  then: Transition_JSON;
  catch: Transition_JSON;
  finally?: string[];
}

export type ServicePromise_JSON = {
  src: string;
  description?: string;
  then: SingleOrArray<Transition_JSON>;
  catch: SingleOrArray<Transition_JSON>;
  finally?: SingleOrArray<Action_JSON>;
};
