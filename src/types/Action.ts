import type { EventObject } from './Event';
import type { Props } from './Props';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

type Types = 'void' | 'assign' | 'start';

export type ActionTypes = `${DefaultTypes['action']}.${Types}`;

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): void;
}['bivarianceHack'];

export interface Action<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> extends BaseType {
  id: string;
  exec: ActionFunction<TC, TE, PTC>;
}

export type Action_JSON =
  | string
  | { id: string; description?: string; guards?: SingleOrArray<string> };
