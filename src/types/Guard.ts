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

export type Guards<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> =
  | {
      or: Guard<TC, TE, PTC>[] | Guards<TC, TE, PTC>;
    }
  | {
      and: Guard<TC, TE, PTC>[] | Guards<TC, TE, PTC>;
    }
  | SingleOrArray<Guard<TC, TE, PTC>>;

type Guard_JSON = string | { id: string; description?: string };

export type Guards_JSON =
  | SingleOrArray<Guard_JSON>
  | { and: Guard_JSON[] | Guards_JSON }
  | { or: Guard_JSON[] | Guards_JSON };

//TODO: Reduce Guards
