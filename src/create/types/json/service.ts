import { Extend } from '../_default';
import { Action_JSON } from './action';
import { Transition_JSON } from './transition';

export type ServicePromise_JSON = {
  timeout: number;
  description?: string;
  then: Extend<Transition_JSON>;
  catch: Extend<Transition_JSON>;
  finally?: Extend<Action_JSON>;
};

export type Subscribable_JSON = {
  description?: string;
  complete?: Extend<Action_JSON>;
  next?: Extend<Action_JSON>;
  error: Extend<Transition_JSON>;
};
