import type { EventObject } from './Event';
import type { Props } from './Props';
import type { BaseType, DefaultTypes, SingleOrArray } from './_default';

export type GuardPredicate<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = (props?: Props<TC, TE, PTC>) => boolean;

export interface Guard<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> extends BaseType {
  type: DefaultTypes['guard'];
  name: string;
  predicate: GuardPredicate<TC, TE, PTC>;
}

export type GuardsOr<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = {
  or: (
    | Guard<TC, TE, PTC>
    | GuardsOr<TC, TE, PTC>
    | GuardsAnd<TC, TE, PTC>
  )[];
};

export type GuardsAnd<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = {
  and: (
    | Guard<TC, TE, PTC>
    | GuardsOr<TC, TE, PTC>
    | GuardsAnd<TC, TE, PTC>
  )[];
};

export type Guards<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> =
  | GuardsOr<TC, TE, PTC>
  | GuardsAnd<TC, TE, PTC>
  | SingleOrArray<Guard<TC, TE, PTC>>;

type Guard_JSON = { id: string; description?: string };

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
