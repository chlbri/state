import type { Action, Action_JSON } from './Action';
import type { EventObject } from './Event';
import type { Guards, Guards_JSON } from './Guard';
import type { BaseType, SingleOrArray } from './_default';

export type TransitionType =
  | 'state.transition.emit'
  | 'state.transition.then'
  | 'state.transition.catch';

export interface Transition<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> extends BaseType {
  type: TransitionType;
  guards?: Guards<TC, TE, PTC>;
  actions?: Action<TC, TE, PTC>[];
  target?: string;
}

export type Transition_JSON =
  | string
  | {
      description?: string;
      guards?: Guards_JSON;
      in?: SingleOrArray<string>;
      actions?: SingleOrArray<Action_JSON>;
      target?: string;
    };

//TODO: Execute Transition
