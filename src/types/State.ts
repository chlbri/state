import type { EventEmit } from './Event';
import type { Transition } from './Transition';
import type { BaseType, DefaultTypes } from './_default';

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

  constructor(public name: string) {}
}
