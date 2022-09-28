import type { Action_JSON } from './Action';
import type { Guards_JSON } from './Guard';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

export interface Transition extends BaseType {
  libraryType: DefaultTypes['transition'];
  guards?: Guards_JSON;
  in?: SingleOrArray<string>;
  actions?: SingleOrArray<Action_JSON>;
  target?: string;
}

/**
 * type <string> for target
 * type <string[]> for actions
 */
export type Transition_JSON =
  | string[]
  | WithString<{
      description?: string;
      guards?: Guards_JSON;
      in?: SingleOrArray<string>;
      actions?: SingleOrArray<Action_JSON>;
      target?: string;
    }>;
