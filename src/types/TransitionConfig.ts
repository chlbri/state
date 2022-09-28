import type { EventObject } from './Event';
import type { Transition, Transition_JSON } from './Transition';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type DefaultTransitionConfigType = DefaultTypes['transitionConfig'];

export interface TransitionConfig<TE extends EventObject = EventObject>
  extends BaseType {
  libraryType: DefaultTransitionConfigType;
  event: TE;
  transitions: SingleOrArray<Transition>;
} 

export type TransitionConfig_JSON = {
  [event: string]: SingleOrArray<Transition_JSON>;
};
