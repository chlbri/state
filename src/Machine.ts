import { STRINGS } from '@-constants';
import { EventObject, NodeWithChildren, State } from '@-types';
import { decompose, StateValue } from '@bemedev/decompose';
import { createMachine } from './functions/machine';

type Props<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = ReturnType<typeof createMachine<TC, TE, PTC>>;

export class Machine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> {
  constructor(private props: Props<TC, TE, PTC>) {
    this._config = props.nodes[0] as NodeWithChildren<TC, TE, PTC>;
    this._state = {
      context: props.initials.context,
      matches: this._createMatch(),
    };
  }

  private _stateValue: StateValue = STRINGS.DEFAULT_STATE_DELIMITER;
  private readonly _config: NodeWithChildren<TC, TE, PTC>;

  _state: State<TC>;
  get state() {
    return this._state;
  }

  private _createMatch() {
    return (...searches: string[]) => {
      const decomposeds = decompose(this._stateValue);
      return searches.every(search => decomposeds.includes(search));
    };
  }

  private _updateState() {
    this._state.matches = this._createMatch();
  }

  initializeStateValue() {
    if (this._config.type == 'parallel') {
      this._stateValue;
    } else {
      const initial = this._config.initial;
      if (!initial) throw new Error();
      this._stateValue = { '/': initial };
    }
    this._updateState();
  }
}
