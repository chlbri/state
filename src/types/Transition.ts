import type { StateValue } from '@bemedev/decompose';
import { decompose } from '@bemedev/decompose';
import cloneDeep from 'lodash.clonedeep';
import { DEFAULT_TYPES } from '../constants/objects';
import { isArray, isSingle } from '../helpers';
import { reduceGuards } from '../helpers/Guards';
import type { Action, Action_JSON } from './Action';
import type { EventObject } from './Event';
import type { Guards, Guards_JSON } from './Guard';
import type { Out } from './Out';
import type { Props, PropsWithValue } from './Props';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

export interface TransitionProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> extends BaseType {
  libraryType: DefaultTypes['transition'];
  guards?: Guards<TC, TE, PTC>;
  in?: SingleOrArray<string>;
  actions?: Action<TC, TE, PTC, PTE>[];
  target?: string;
}

export class Transition<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> implements BaseType
{
  get libraryType() {
    return DEFAULT_TYPES.transition;
  }

  get description() {
    return this.props.description;
  }

  get target() {
    return this.props.target;
  }

  private checkIn(value: StateValue) {
    let executable = true;
    const _ins = this.props.in;
    const decomposeds = decompose(value);
    if (isSingle(_ins)) {
      executable = decomposeds.includes(_ins);
    }
    if (isArray(_ins)) {
      executable = _ins.every(_in => decomposeds.includes(_in));
    }
    return executable;
  }

  private checkGuards(props: Props<TC, TE, PTC, PTE>) {
    let executable = true;
    const guards = this.props.guards;
    if (guards) {
      const guard = reduceGuards(guards);
      executable = guard(props);
    }
    return executable;
  }

  private executeActions(_props: Props<TC, TE, PTC>) {
    const actions = this.props.actions;
    const props = cloneDeep(_props);
    let result: Out<TC, PTC> = {
      context: props.context,
      privateContext: props.privateContext,
    };
    if (actions) {
      actions.forEach(({ exec }) => {
        result = exec({
          context: cloneDeep(result.context),
          event: props.event,
          privateContext: cloneDeep(result.privateContext),
        });
      });
      return result;
    }
    return result;
  }

  readonly check = ({
    value,
    ...props
  }: PropsWithValue<TC, TE, PTC, PTE>) => {
    return this.checkIn(value) && this.checkGuards(props);
  };

  constructor(private props: TransitionProps<TC, TE, PTC, PTE>) {}

  execute(props: Props<TC, TE, PTC, PTE>) {
    const result = this.executeActions(props);

    const _props: Out<TC, PTC> = {
      context: result.context,
      privateContext: result.privateContext,
      target: this.props.target,
    };

    return _props;
  }
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
