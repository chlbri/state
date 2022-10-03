import { NOmit } from '@bemedev/core';
import z from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';
import type { EventObject } from './Event';
import type { Props } from './Props';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

export const guardJSONschema = z
  .object({
    id: z.string(),
    description: z.string().optional(),
  })
  .strict();

export const unionGuard = () => {
  return z.array(
    z.union([
      guardJSONschema,
      guardOrJSONschema,
      guardAndJSONschema,
      z.string(),
    ]),
  );
};

export const guardOrJSONschema: z.ZodType<GuardsOr_JSON> = z.lazy(() =>
  z.object({
    or: unionGuard(),
  }),
);

export const guardAndJSONschema: z.ZodType<GuardsAnd_JSON> = z.lazy(() =>
  z.object({
    and: unionGuard(),
  }),
);

export const guardsJSONschema = z.union([
  guardJSONschema,
  unionGuard(),
  z.string(),
  guardOrJSONschema,
  guardAndJSONschema,
  z.undefined(),
]);

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
  predicate?: GuardPredicate<TC, TE, PTC>;
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

export type Guard_JSON = { id: string; description?: string };

export type GuardUnion = WithString<
  GuardsOr_JSON | GuardsAnd_JSON | Guard_JSON
>;

export type GuardsOr_JSON = {
  or: GuardUnion[];
};

export type GuardsAnd_JSON = {
  and: GuardUnion[];
};

export type Guards_JSON =
  | SingleOrArray<WithString<Guard_JSON>>
  | GuardsAnd_JSON
  | GuardsOr_JSON;

export function createGuard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props: NOmit<Guard<TC, TE, PTC>, 'libraryType'>): Guard<TC, TE, PTC> {
  return { ...props, libraryType: DEFAULT_TYPES.guard };
}
