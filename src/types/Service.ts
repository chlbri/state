import type { EventError } from './Event';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NExtract } from '@bemedev/core';
import { timeoutPromise } from '../helpers';
import type { EventData, EventEmit } from './Event';
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

export interface ServiceProps<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
  T extends ServiceType = PromT,
  R extends Promise<any> = Promise<any>,
  D = unknown,
  E extends Error = Error,
> extends BaseType {
  type: T;
  timeout: number;
  exec: (
    props?: Props<TC, TE, PTC>,
  ) => T extends PromT ? R : Subscribable<TE>;
  then: SingleOrArray<Transition<TC, EventData<D>, PTC>>;
  catch: SingleOrArray<Transition<TC, EventError<E>, PTC>>;
  finally?: (props?: Props<TC, TE, PTC>) => void;
}

export class Service<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
  T extends ServiceType = PromT,
  R extends Promise<any> = Promise<any>,
  D = unknown,
  E extends Error = Error,
> implements ServiceProps<TC, TE, PTC, T, R, D, E>
{
  get type() {
    return this.props.type;
  }

  get timeout() {
    return this.props.timeout;
  }

  exec: typeof this.props.exec;

  get then() {
    return this.props.then;
  }

  get catch() {
    return this.props.catch;
  }

  finally = this.props.finally;

  description?: string;

  constructor(private props: ServiceProps<TC, TE, PTC, T, R, D, E>) {
    if (props.type === promT) {
      this.exec = timeoutPromise(props.timeout, props.exec as any) as any;
    } else {
      this.exec = props.exec;
    }
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

//TODO: Separate Subecribable from promise
