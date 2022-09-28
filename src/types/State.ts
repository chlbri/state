import { NOmit } from '@bemedev/core';
import { DEFAULT_TYPES } from '../constants/objects';
import { createError } from '../helpers/Errors';
import { getLastDefined } from '../helpers/getLastDefined';
import { Action } from './Action';
import type { EventObject } from './Event';
import { createGuard, GuardPredicate } from './Guard';
import { createPromise, ServicePromise } from './Service';
import type { BaseType, DefaultTypes } from './_default';

export type DefaultStateType = DefaultTypes['state'];

export type Schema<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  guards: Record<string, GuardPredicate<TC, TE, PTC>>;
  actions: Record<string, NOmit<Action<TC, TE, PTC>, 'id'>>;
  promises: Record<
    string,
    NOmit<ServicePromise<TC, TE, PTC>, 'id' | 'libraryType'>
  >;
};

export interface StateProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  S extends Schema<TC, TE, PTC> = Schema<TC, TE, PTC>,
> extends NOmit<BaseType, 'libraryType'> {
  _id: string;
  id?: string;
  guards: S['guards'];
  actions: S['actions'];
  promises: S['promises'];
  values: string[];
}

const ERRORS = {
  id: createError({ code: 's-01', message: 'Id is undefined' }),
  guard: createError({ code: 's-02', message: 'Guard not found' }),
  action: createError({ code: 's-03', message: 'Action not found' }),
  promise: createError({ code: 's-05', message: 'Promise not found' }),
} as const;

export class State<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  S extends Schema<TC, TE, PTC> = Schema<TC, TE, PTC>,
> implements BaseType
{
  static get ERRORS() {
    return ERRORS;
  }

  get libraryType() {
    return DEFAULT_TYPES.state;
  }

  get id() {
    return getLastDefined(this.props.id, this.props._id);
  }

  get description() {
    return this.props.description;
  }

  private get guards() {
    const _guards = Object.entries(this.props.guards ?? {});
    return _guards.map(([id, predicate]) =>
      createGuard({ id, predicate }),
    );
  }

  private get actions(): Action<TC, TE, PTC>[] {
    const _actions = Object.entries(this.props.actions ?? {});
    return _actions.map(([id, action]) => {
      return { id, ...action };
    });
  }

  private get promises() {
    const _promises = Object.entries(this.props.promises ?? {});
    return _promises.map(([id, promise]) => {
      return createPromise({ ...promise, id });
    });
  }

  constructor(private props: StateProps<TC, TE, PTC, S>) {}

  getGuard(searchId?: string) {
    if (!searchId) throw State.ERRORS.id;
    const guard = this.guards.find(({ id }) => id === searchId);
    if (!guard) throw State.ERRORS.guard;
    return guard;
  }

  getAction(searchId?: string) {
    if (!searchId) throw State.ERRORS.id;
    const action = this.actions.find(({ id }) => id === searchId);
    if (!action) throw State.ERRORS.action;
    return action;
  }

  checkState(value: string[] | string) {
    if (typeof value === 'string') {
      return this.props.values.includes(value);
    }
    return value.every(v => this.props.values.includes(v));
  }

  getPromise(searchId?: string) {
    if (!searchId) throw State.ERRORS.id;
    const promise = this.promises.find(({ id }) => id === searchId);
    if (!promise) throw State.ERRORS.promise;
    return promise;
  }
}
