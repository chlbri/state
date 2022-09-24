import { StateValue } from '@bemedev/decompose';
import type { EventEmit } from './Event';
import { Props } from './Props';
import type { Transition } from './Transition';
import type { BaseType, DefaultTypes } from './_default';

export type StateProps<TC extends object, PTC extends object> = {
  context: TC;
  privateContext: PTC;
  value: string;
  id: string;
};

export class State<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
> implements BaseType
{
  description?: string;
  type: DefaultTypes['state'] = 'state_manager.state';
  id?: string;
  transitionConfigs?: Transition<TC, TE, PTC>[];

  get value() {
    return this._value;
  }

  constructor(private _value: StateValue) {}

  async send(props: Props<TC, TE, PTC>) {
    //TODO: Send Events

  }
}
