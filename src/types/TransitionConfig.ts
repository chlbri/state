import { EventEmit } from './Event';
import { Transition, Transition_JSON } from './Transition';
import { SingleOrArray } from './_default';

export type TransitionConfig<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> = {
  event: TE;
  transitions: SingleOrArray<Transition<TC, TE, PTC>>;
};

export type TransitionConfig_JSON = {
  [event: string]: string | SingleOrArray<Transition_JSON>;
};
