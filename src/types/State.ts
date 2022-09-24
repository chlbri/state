import { NOmit } from '@bemedev/core';
import { StateValue } from '@bemedev/decompose';
import cloneDeep from 'lodash.clonedeep';
import { DEFAULT_TYPES } from '../constants/objects';
import { isArray, isSingle } from '../helpers';
import type { EventEmit } from './Event';
import type { Out } from './Out';
import type { TransitionConfig } from './TransitionConfig';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type DefaultStateType = DefaultTypes['state'];

export interface StateProps<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> {
  transitions?: SingleOrArray<TransitionConfig<TC, TE, PTC>>;
  context: TC;
  privateContext: PTC;
  value: StateValue;
}

export class State<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> implements NOmit<BaseType, 'description'>
{
  get libraryType() {
    return DEFAULT_TYPES.state;
  }

  private readonly props: StateProps<TC, TE, PTC>;

  constructor(props: StateProps<TC, TE, PTC>) {
    this.props = cloneDeep(props);
  }

  async send(event: TE) {
    const { value, context, privateContext, transitions } = this.props;
    let props: Out<TC, PTC> = { context, privateContext };

    if (isSingle(transitions)) {
      if (transitions.check(event)) {
        props = transitions.execute({
          value,
          context,
          event,
          privateContext,
        });
      }
    }

    if (isArray(transitions)) {
      for (const transition of transitions) {
        if (transition.check(event)) {
          props = transition.execute({
            value,
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
