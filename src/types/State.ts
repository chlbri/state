import { NOmit } from '@bemedev/core';
import cloneDeep from 'lodash.clonedeep';
import { DEFAULT_TYPES } from '../constants/objects';
import { createError } from '../helpers/Errors';
import { getLastDefined } from '../helpers/getLastDefined';
import { Action } from './Action';
import type { EventEmit, EventObject } from './Event';
import { Guard } from './Guard';
import { ServicePromise } from './Service';
import type { BaseType, DefaultTypes } from './_default';

export type DefaultStateType = DefaultTypes['state'];

export interface StateProps<
  TC extends object = object,
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
  R extends PTE = PTE,
> {
  _id: string;
  id?: string;
  guards: Guard<TC, TE, PTC, PTE>[];
  actions: Action<TC, TE, PTC, PTE>[];
  promises: ServicePromise<TC, TE, PTC, PTE, R>[];
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
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
  R extends PTE = PTE,
> implements NOmit<BaseType, 'description'>
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
  //TODO: create a function diminution
  //TODO: Create the state machine and manage all

  private readonly props: StateProps<TC, TE, PTC, PTE, R>;

  constructor(props: StateProps<TC, TE, PTC, PTE, R>) {
    this.props = cloneDeep(props);
  }

  getGuard(searchId?: string) {
    if (!searchId) throw State.ERRORS.id;
    const guard = this.props.guards.find(guard => guard.id === searchId);
    if (!guard) throw State.ERRORS.guard;
    return guard;
  }

  getAction(searchId?: string) {
    if (!searchId) throw State.ERRORS.id;
    const action = this.props.actions.find(guard => guard.id === searchId);
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
    const promise = this.props.promises.find(
      promise => promise.id === searchId,
    );
    if (!promise) throw State.ERRORS.promise;
    return promise;
  }
}
