import { Extend, SingleOrArray } from '../_default';
import { Action_JSON } from './action';
import { GuardUnion } from './guard';

export type Transition_JSON = {
  description?: string | undefined;
  target?: string | undefined;
  in?: SingleOrArray<string>;
  actions?: Extend<Action_JSON>;
  guards?: SingleOrArray<GuardUnion>;
};
