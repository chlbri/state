import type { EventObject } from './Event';
import type { Props } from './Props';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

export type GuardPredicate<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = (props?: Props<TC, TE, PTC, PTE>) => boolean;

interface _Guard<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> {
  predicate: GuardPredicate<TC, TE, PTC, PTE>;
}

export interface Guard<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> extends BaseType {
  libraryType: DefaultTypes['guard'];
  id: string;
  predicate: GuardPredicate<TC, TE, PTC, PTE>;
}

export type GuardsOr<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = {
  or: (
    | _Guard<TC, TE, PTC, PTE>
    | GuardsOr<TC, TE, PTC, PTE>
    | GuardsAnd<TC, TE, PTC, PTE>
  )[];
};

export type GuardsAnd<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = {
  and: (
    | _Guard<TC, TE, PTC, PTE>
    | GuardsOr<TC, TE, PTC, PTE>
    | GuardsAnd<TC, TE, PTC, PTE>
  )[];
};

export type Guards<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> =
  | ({
      libraryType: DefaultTypes['guard'];
      id: string;
    } & (GuardsOr<TC, TE, PTC, PTE> | GuardsAnd<TC, TE, PTC, PTE>))
  | SingleOrArray<Guard<TC, TE, PTC, PTE>>;

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
