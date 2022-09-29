import type { Action_JSON } from './Action';
import type { Guards_JSON } from './Guard';
import type { SingleOrArray, WithString } from './_default';

/**
 * type <string> for target
 * type <string[]> for actions
 */
export type Transition = {
  description?: string;
  guards?: Guards_JSON;
  in?: SingleOrArray<string>;
  actions?: SingleOrArray<Action_JSON>;
  target?: string;
};

export type TransitionExtend = string[] | WithString<Transition>;

export function createTransition(
  transitions: TransitionExtend | TransitionExtend[],
): Transition[] {
  if (typeof transitions === 'string') {
    return [{ target: transitions }];
  }
  if (Array.isArray(transitions)) {
    const isStringArray = transitions.every(
      transition => typeof transition === 'string',
    );
    if (isStringArray) {
      return [{ actions: transitions as string[] }];
    }
    return transitions.map(createTransition).flat();
  } else {
    return [transitions];
  }
}
