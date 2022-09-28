import { NOmit } from '@bemedev/core';
import { DEFAULT_TYPES } from '../constants/objects';
import type { EventObject } from './Event';
import type { Props } from './Props';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

export type GuardPredicate<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = (props?: Props<TC, TE, PTC>) => boolean;

export interface Guard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  libraryType: DefaultTypes['guard'];
  id: string;
  predicate: GuardPredicate<TC, TE, PTC>;
}

export type GuardsOr<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  or: GuardsOption<TC, TE, PTC>[];
};

export type GuardsAnd<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  and: GuardsOption<TC, TE, PTC>[];
};

export type GuardsOption<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = Guard<TC, TE, PTC> | GuardsOr<TC, TE, PTC> | GuardsAnd<TC, TE, PTC>;

export type Guards<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> =
  | (GuardsOr<TC, TE, PTC> | GuardsAnd<TC, TE, PTC>)
  | SingleOrArray<Guard<TC, TE, PTC>>;

type Guard_JSON = WithString<{ id: string; description?: string }>;

export type GuardsOr_JSON = {
  or: (Guard_JSON | GuardsOr_JSON | GuardsAnd_JSON)[];
};

export type GuardsAnd_JSON = {
  and: (Guard_JSON | GuardsOr_JSON | GuardsAnd_JSON)[];
};

export type Guards_JSON =
  | SingleOrArray<Guard_JSON>
  | GuardsAnd_JSON
  | GuardsOr_JSON;

export function createGuard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props: NOmit<Guard<TC, TE, PTC>, 'libraryType'>): Guard<TC, TE, PTC> {
  return { ...props, libraryType: DEFAULT_TYPES.guard };
}
