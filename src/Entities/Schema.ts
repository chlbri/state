import { NOmit } from '@bemedev/core';
import { Action, ActionFunction } from './Action';
import { EventObject } from './Event';
import { AsyncFunctionEvent } from './Function';
import { GuardPredicate } from './Guard';
import { ServicePromise, Subscribable } from './Service';

export type Schema<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  guards: Record<string, GuardPredicate<TC, TE, PTC>>;
  actions: Record<string, NOmit<Action<TC, TE, PTC>, 'id'>>;
  promises: Record<
    string,
    NOmit<ServicePromise<TC, TE, PTC>, 'src' | 'libraryType'>
  >;
};

export type Definitions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  guards?: Record<string, GuardPredicate<TC, TE, PTC>>;
  actions?: Record<string, ActionFunction<TC, TE, PTC>>;
  promises?: Record<string, AsyncFunctionEvent<TC, TE, PTC>>;
  subcribables?: Record<
    string,
    Subscribable<TE> | { sub: Subscribable<any>; map: (value: any) => TE }
  >;
};
