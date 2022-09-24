import { decompose, StateValue } from '@bemedev/decompose';
import { isSingle } from '../helpers';
import type { EventEmit } from './Event';
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
  transitions?: Transition<TC, TE, PTC>[];

  get value() {
    return this._value;
  }

  private get decomposeds() {
    return decompose(this._value);
  }

  constructor(private _value: StateValue) {}

  async executeTransition() {
    if (!this.transitions) {
      return;
    }
    this.transitions.forEach(transition => {
      let executeThis = true;
      const _in = transition.in;
      if (_in) {
        if (isSingle(_in)) {
          executeThis = this.decomposeds.includes(_in);
        } else {
          executeThis = _in.every(__in => this.decomposeds.includes(__in));
        }
      }
      if (!executeThis) return;
    });
  }
}
