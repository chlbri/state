import type { NExtract, NOmit } from '@bemedev/core';
import { timeoutPromise } from '../helpers';
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
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
  R extends Promise<any> = Promise<any>,
> extends NOmit<BaseType, 'type'> {
  timeout: number;
  exec: (props?: Props<TC, TE, PTC>) => R;
  then: SingleOrArray<Transition<TC, EventData<Awaited<R>>, PTC>>;
  catch: SingleOrArray<Transition<TC, EventError, PTC>>;
  finally?: (props?: Props<TC, TE, PTC>) => void;
}

export class ServicePromise<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
  R extends Promise<any> = Promise<any>,
> implements ServicePromiseProps<TC, TE, PTC, R>
{
  get type() {
    return promT;
  }

  get timeout() {
    return this.props.timeout;
  }

  readonly exec: typeof this.props.exec;

  get then() {
    return this.props.then;
  }

  get catch() {
    return this.props.catch;
  }

  finally = this.props.finally;

  description?: string;

  constructor(private props: ServicePromiseProps<TC, TE, PTC, R>) {
    this.exec = timeoutPromise(props.timeout, props.exec);
  }
}

export type Service_JSON =
  | string
  | {
      id: string;
      description?: string;
      then: SingleOrArray<Transition_JSON>;
      catch: SingleOrArray<Transition_JSON>;
      finally?: string;
    };

//TODO: Separate Subscribable from promise
