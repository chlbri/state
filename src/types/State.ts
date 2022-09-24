import cloneDeep from 'lodash.clonedeep';
import { DEFAULT_TYPES } from '../constants/objects';
import { isArray, isSingle } from '../helpers';
import type { EventEmit } from './Event';
import type { Out } from './Out';
import type { PropsWithValue } from './Props';
import type { TransitionConfig } from './TransitionConfig';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type DefaultStateType = DefaultTypes['state'];

export interface StateProps<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> extends BaseType {
  _id: string;
  id?: string;
  transitionConfigs?: SingleOrArray<TransitionConfig<TC, TE, PTC>>;
}

export class State<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> implements BaseType
{
  get description() {
    return this.props.description;
  }

  get _id() {
    return this.props._id;
  }

  get id() {
    return this.props.id;
  }

  get type() {
    return DEFAULT_TYPES.state;
  }

  constructor(private props: StateProps<TC, TE, PTC>) {}

  async send({
    value,
    context,
    event,
    privateContext,
  }: PropsWithValue<TC, TE, PTC>) {
    let props: Out<TC, PTC> = cloneDeep({ context, privateContext });

    const transitions = this.props.transitionConfigs;

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
