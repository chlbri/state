import { EventObject } from './event';
import { Node_JSON } from './json';
import {
  ActionDelay,
  ActionFunction,
  AsyncFunctionEvent,
  GuardPredicate,
  Subscribable,
} from './output';

export type ExecutableWithDescription<
  Executable extends ((...args: any[]) => any) | Subscribable,
> =
  | Executable
  | {
      exec: Executable;
      description?: string;
    };

export type Definitions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  guards?: Record<
    string,
    ExecutableWithDescription<GuardPredicate<TC, TE, PTC>>
  >;

  actions?: Record<
    string,
    ExecutableWithDescription<ActionFunction<TC, TE, PTC>>
  >;

  promises?: Record<
    string,
    ExecutableWithDescription<AsyncFunctionEvent<TC, TE, PTC>>
  >;

  subcribables?: Record<
    string,
    ExecutableWithDescription<Subscribable<TE>>
  >;

  durations?: Record<
    string,
    ExecutableWithDescription<ActionDelay<TC, TE, PTC>>
  >;

  nodes?: Record<string, Node_JSON>;
};
