import { NOmit } from '@bemedev/core';
import cloneDeep from 'lodash.clonedeep';
import { DEFAULT_TYPES } from '../constants/objects';
import { createError } from '../helpers/Errors';
import { Action } from './Action';
import type { EventEmit } from './Event';
import { Guard } from './Guard';
import { ServicePromise } from './Service';
import type { BaseType, DefaultTypes } from './_default';

export type DefaultStateType = DefaultTypes['state'];

export interface StateProps<
  TC extends object = object,
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventEmit = EventEmit,
  R = any,
> {
  guards: Guard<TC, TE, PTC, PTE>[];
  actions: Action<TC, TE, PTC, PTE>[];
  promise?: ServicePromise<TC, TE, PTC, PTE, R>;
  values: string[];
}

const ERRORS = {
  guard: new Error('Guard not found'),
  action: new Error('Action not found'),
  promise: {
    notExists: new Error('Promise not exists'),
    notFound: new Error('Promise not found'),
  },
  id: new Error('Id not exists'),
} as const;

export class State<
  TC extends object = object,
  TE extends EventEmit = EventEmit,
  PTC extends object = object,
  PTE extends EventEmit = EventEmit,
  R = any,
> implements NOmit<BaseType, 'description'>
{
  static get ERRORS() {
    return ERRORS;
  }

  get libraryType() {
    return DEFAULT_TYPES.state;
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
    const find = this.props.actions.find(guard => guard.id === searchId);
    if (!find) createError({ code: '', message: '' });
    return find;
  }

  checkState(value: string) {
    return this.props.values.includes(value);
  }

  getPromise(searchId?: string) {
    if (!searchId) throw State.ERRORS.id;
    const promise = this.props.promise;
    if (!promise) throw State.ERRORS.promise.notExists;
    if (promise.id === searchId) throw State.ERRORS.promise.notFound;
    return promise;
  }
}
