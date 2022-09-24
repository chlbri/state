import type { NOmit } from '@bemedev/core';
import cloneDeep from 'lodash.clonedeep';
import { DEFAULT_TYPES } from '../constants/objects';
import { isSingle } from '../helpers';
import { compareEvents } from '../helpers/Event';
import type { EventEmit } from './Event';
import type { Out } from './Out';
import type { PropsWithValue } from './Props';
import type { Transition, Transition_JSON } from './Transition';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type DefaultTransitionConfigType = DefaultTypes['transitionConfig'];

export interface TransitionConfigProps<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> extends NOmit<BaseType, 'type'> {
  event: TE;
  transitions: SingleOrArray<Transition<TC, TE, PTC>>;
}

export class TransitionConfig<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> implements BaseType
{
  get type() {
    return DEFAULT_TYPES.transitionConfig;
  }

  get description() {
    return this.props.description;
  }

  constructor(private props: TransitionConfigProps<TC, TE, PTC>) {}

  readonly check = (event?: EventEmit) => {
    return compareEvents(this.props.event, event);
  };

  execute({
    value,
    context,
    event,
    privateContext,
  }: PropsWithValue<TC, TE, PTC>) {
    const transitions = this.props.transitions;
    let props: Out<TC, PTC> = cloneDeep({ context, privateContext });

    if (isSingle(transitions)) {
      const check = transitions.check({
        value,
        context,
        event,
        privateContext,
      });

      if (check) {
        props = transitions.execute({
          context,
          event,
          privateContext,
        });
      }
    } else {
      for (const transition of transitions) {
        const check = transition.check({
          value,
          context,
          event,
          privateContext,
        });

        if (check) {
          props = transition.execute({
            event,
            context,
            privateContext,
          });
          break;
        }
      }
    }

    return props;
  }
}

export type TransitionConfig_JSON = {
  [event: string]: SingleOrArray<Transition_JSON>;
};
