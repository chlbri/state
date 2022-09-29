import { DEFAULT_TYPES } from '../constants/objects';
import type { EventObject } from './Event';
import type { Props } from './Props';
import type { BaseType, WithString } from './_default';

export const ACTIONS_TYPES = {
  void: `${DEFAULT_TYPES.action}.void`,
  assign: `${DEFAULT_TYPES.action}.assign`,
  start: `${DEFAULT_TYPES.action}.start`,
} as const;

type Types = keyof typeof ACTIONS_TYPES;

export type ActionTypes = typeof ACTIONS_TYPES[Types];

export type Out<TC extends object, PTC extends object> = {
  context?: TC;
  privateContext?: PTC;
  target?: string;
};

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): Out<TC, PTC>;
}['bivarianceHack'];

export interface Action<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  id: string;
  libraryType: ActionTypes;
  exec: ActionFunction<TC, TE, PTC>;
}

function assign<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(assigner: ActionFunction<TC, TE, PTC>) {
  return { exec: assigner, libraryType: ACTIONS_TYPES.assign };
}

export const Actions = {
  assign,
};

export type Action_JSON = WithString<{
  id: string;
  description?: string;
}>;
