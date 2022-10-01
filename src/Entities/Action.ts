import { DEFAULT_TYPES } from '../constants/objects';
import type { EventObject } from './Event';
import type { Props } from './Props';
import type { BaseType, DefaultTypes } from './_default';

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
  libraryType: DefaultTypes['action'];
  exec?: ActionFunction<TC, TE, PTC>;
}

function assign<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(assigner: ActionFunction<TC, TE, PTC>) {
  return { exec: assigner, libraryType: DEFAULT_TYPES.action };
}

export const Actions = {
  assign,
};

export type Action_JSON = {
  id: string;
  description?: string;
};
