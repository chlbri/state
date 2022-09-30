import { DEFAULT_TYPES } from '../constants/objects';
import {
  createTransition,
  Transition,
  TransitionExtend,
} from './Transition';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type DefaultTransitionConfigType = DefaultTypes['transitionConfig'];

export interface TransitionConfig extends BaseType {
  libraryType: DefaultTransitionConfigType['options'][keyof DefaultTransitionConfigType['options']];
  eventType: string;
  transitions: Transition[];
}

export type TransitionMap_JSON = {
  [event: string]: SingleOrArray<TransitionExtend>;
};

export function createTransitionConfigs(
  props?: TransitionMap_JSON,
): TransitionConfig[] {
  if (!props) return [];
  const transitions = Object.entries(props);
  return transitions.map(([eventType, transition]) => {
    return {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType,
      transitions: createTransition(transition),
    };
  });
}
