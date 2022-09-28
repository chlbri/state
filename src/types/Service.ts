import type { NExtract, NOmit } from '@bemedev/core';
import { cloneFunction, timeoutPromise } from '../helpers';
import { Action_JSON } from './Action';
import type { EventData, EventEmit, EventError } from './Event';
import type { Props } from './Props';
import type { Transition, Transition_JSON } from './Transition';
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

export interface ServicePromiseProps<
  TC extends object = object,
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventEmit = EventEmit,
  R = any,
> extends NOmit<BaseType, 'libraryType'> {
  id: string;
  timeout: number;
  exec: (props?: Props<TC, TE, PTC>) => Promise<R>;
  then: SingleOrArray<Transition<TC, EventData<Awaited<R>>, PTC>>;
  catch: SingleOrArray<Transition<TC, EventError, PTC>>;
  finally?: (props?: Props<TC, TE, PTC>) => void;
}

export class ServicePromise<
  TC extends object = object,
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventEmit = EventEmit,
  R = any,
> {
  get type() {
    return promT;
  }

  get id() {
    return this.props.id;
  }

  get timeout() {
    return this.props.timeout;
  }

  readonly exec: typeof this.props.exec;

  readonly finally: typeof this.props.finally;

  description?: string;

  constructor(private props: ServicePromiseProps<TC, TE, PTC, PTE, R>) {
    // TODO: verify if it's needed to clone for all functions here
    this.exec = timeoutPromise(props.timeout, props.exec);
    this.finally = cloneFunction(props.finally);
  }
}

export type ServicePromise_JSON = {
  src: string;
  description?: string;
  then: SingleOrArray<Transition_JSON>;
  catch: SingleOrArray<Transition_JSON>;
  finally?: SingleOrArray<Action_JSON>;
};
