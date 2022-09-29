import {
  transitionActionsSchema,
  transitionComplexSchema,
} from '../helpers/typeChecking/Transtions';

// TODO:  createMachine Function

import { DEFAULT_TYPES } from '../constants/objects';
import {
  actionComplexSchema,
  actionSimpleSchema,
  createError,
  guardAndJSONschema,
  guardJSONschema,
  guardOrJSONschema,
  isArray,
  reduceGuards,
} from '../helpers';
import { transitionTargetSchema } from '../helpers/typeChecking/Transtions';
import { Out } from './Action';
import { EventObject } from './Event';
import { Guards, GuardsOption, Guards_JSON } from './Guard';
import { Props } from './Props';
import { Schema, State } from './State';
import { Transition } from './Transition';

export interface MachineProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  S extends Schema<TC, TE, PTC> = Schema<TC, TE, PTC>,
> {
  context: TC;
  privateContext: PTC;
  states: State<TC, TE, PTC, S>[];
  values: string[];
}

const ERRORS = {
  master: createError({ code: 'm-01', message: 'Master state not found' }),
  id: createError({ code: 'm-03', message: 'ID not exists' }),
  state: {
    notFound: createError({ code: 'm-02', message: 'State not found' }),
    same: createError({ code: 'm-04', message: 'ID is current' }),
  },
  promise: createError({ code: 'm-05', message: 'Promise not found' }),
  transition: createError({
    code: 'm-06',
    message: 'Transtion not reachable',
  }),
} as const;

export class Machine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  S extends Schema<TC, TE, PTC> = Schema<TC, TE, PTC>,
> {
  static get ERRORS() {
    return ERRORS;
  }

  readonly id = '/';

  private currentState: State<TC, TE, PTC, S>;

  constructor(private props: MachineProps<TC, TE, PTC, S>) {
    const _state = props.states.find(state => state.id === this.id);
    if (!_state) throw Machine.ERRORS.master;
    this.currentState = _state;
  }

  private constructProps(event?: TE): Props<TC, TE, PTC> {
    return {
      context: this.props.context,
      privateContext: this.props.privateContext,
      event,
    };
  }

  readonly changeState = (searchStateId?: string) => {
    if (!searchStateId) throw Machine.ERRORS.id;
    if (searchStateId === this.id) throw Machine.ERRORS.state.same;
    const _state = this.props.states.find(
      ({ id }) => id === searchStateId,
    );
    if (!_state) throw Machine.ERRORS.state.notFound;
    return _state;
  };

  performAction(searchActionId?: string, event?: TE) {
    const action = this.currentState.getAction(searchActionId);
    const props = this.constructProps(event);
    return action.exec(props);
  }

  // #region GUARDS
  private createGuards(guards?: Guards_JSON): Guards<TC, TE, PTC> {
    if (!guards) throw Machine.ERRORS.id;
    const simple = guardJSONschema.safeParse(guards);
    if (simple.success) {
      return this.currentState.getGuard(simple.data.id);
    }

    const or = guardOrJSONschema.safeParse(guards);
    if (or.success) {
      const out = {
        or: or.data.or.map(guard =>
          this.createGuards(guard),
        ) as GuardsOption<TC, TE, PTC>[],
      };
      return out;
    }

    const and = guardAndJSONschema.safeParse(guards);
    if (and.success) {
      const out = {
        and: and.data.and.map(guard =>
          this.createGuards(guard),
        ) as GuardsOption<TC, TE, PTC>[],
      };
      return out;
    }

    throw Machine.ERRORS.id;
  }

  performGuards(guards?: Guards<TC, TE, PTC>, event?: TE) {
    if (!guards) throw Machine.ERRORS.id;
    const reducedGuard = reduceGuards(guards);
    const props = this.constructProps(event);
    return reducedGuard(props);
  }
  // #endregion

  private performPromiseTransition(
    transition?: Transition,
    event?: TE,
  ): Out<TC, PTC> {
    if (!transition) throw Machine.ERRORS.id;
    let out: Out<TC, PTC> = {
      context: this.props.context,
      privateContext: this.props.privateContext,
    };
    const _target = transitionTargetSchema.safeParse(transition);
    if (_target.success) {
      out.target = _target.data;
      return out;
    }
    const _actions = transitionActionsSchema.safeParse(transition);
    if (_actions.success) {
      for (const action of _actions.data) {
        out = this.performAction(action, event);
      }
      return out;
    }
    const _complex = transitionComplexSchema.safeParse(transition);
    if (_complex.success) {
      const { guards, target, actions, in: _in } = _complex.data;

      if (_in) {
        const noCheck = this.currentState.checkState(_in);
        if (noCheck) return out;
      }

      if (guards) {
        const _guards = this.createGuards(guards);
        const guard = reduceGuards(_guards);
        const noCheck = !guard(this.constructProps(event));
        if (noCheck) {
          return out;
        }
      }

      if (actions) {
        if (isArray(actions)) {
          for (const action of actions) {
            const simple = actionSimpleSchema.safeParse(action);
            if (simple.success) {
              out = this.performAction(simple.data, event);
              out.target = target;
              return out;
            } else {
              const complex = actionComplexSchema.safeParse(action);
              if (complex.success) {
                out = this.performAction(complex.data.id, event);
                out.target = target;
                return out;
              }
            }
          }
        } else {
          const simple = actionSimpleSchema.safeParse(actions);
          if (simple.success) {
            out = this.performAction(simple.data, event);
            out.target = target;
            return out;
          } else {
            const complex = actionComplexSchema.safeParse(actions);
            if (complex.success) {
              out = this.performAction(complex.data.id, event);
              out.target = target;
              return out;
            }
          }
        }
      }
    }
    throw Machine.ERRORS.transition;
  }

  async performPromise(searchPromiseId?: string, event?: TE) {
    const promise = this.currentState.getPromise(searchPromiseId);
    const props = this.constructProps(event);
    const _then = promise.then;
    const _catch = promise.catch;
    const _finally = promise.finally;

    try {
      const data = (await promise.exec(props)) as any;
      this.performPromiseTransition(_then, data);
    } catch (err: any) {
      const libraryType = `${DEFAULT_TYPES.event}.catch` as const;
      const error = err && err instanceof Error ? err : new Error();
      const event = { libraryType, error, event: libraryType } as any;
      this.performPromiseTransition(_catch, event);
    } finally {
      if (_finally) {
        for (const funcStr of _finally) {
          const action = this.currentState.getAction(funcStr);
          action.exec(this.constructProps(event));
        }
      }
    }
  }
}
