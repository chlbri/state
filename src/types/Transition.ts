import type { Action, Action_JSON } from './Action';
import type { EventObject } from './Event';
import type { Guards, Guards_JSON } from './Guard';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export interface Transition<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> extends BaseType {
  type: DefaultTypes['transition'];
  guards?: Guards<TC, TE, PTC>;
  in?: SingleOrArray<string>;
  actions?: Action<TC, TE, PTC>[];
  target?: string;
}
//TODO: execute transition

export type Transition_JSON = {
  description?: string;
  guards?: Guards_JSON;
  in?: SingleOrArray<string>;
  actions?: SingleOrArray<Action_JSON>;
  target?: string;
};

//TODO: Execute Transition
