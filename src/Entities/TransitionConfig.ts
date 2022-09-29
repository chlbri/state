import { DEFAULT_TYPES } from '../constants/objects';
import { createTransition, Transition, TransitionExtend } from './Transition';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type DefaultTransitionConfigType = DefaultTypes['transitionConfig'];

export interface TransitionConfig extends BaseType {
  libraryType: DefaultTransitionConfigType;
  event: string;
  transitions: Transition[];
}

export type TransitionConfig_JSON = {
  [event: string]: SingleOrArray<TransitionExtend>;
};

export function createTransitionConfigs(
  props?: TransitionConfig_JSON,
): TransitionConfig[] {
  if (!props) return [];
  const transitions = Object.entries(props);
  return transitions.map(([event, transition]) => {
    return {
      libraryType: DEFAULT_TYPES.transitionConfig,
      event,
      transitions: createTransition(transition),
    };
  });
}
