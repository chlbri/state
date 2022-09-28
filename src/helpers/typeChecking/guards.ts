import z from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import {
  EventObject,
  Guard,
  Guards,
  GuardsAnd,
  GuardsAnd_JSON,
  GuardsOr,
  GuardsOr_JSON,
} from '../../types';

export function isSimpleGuard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(value: Guards<TC, TE, PTC>): value is Guard<TC, TE, PTC> {
  return (value as any).type === DEFAULT_TYPES.guard;
}

export function isGuardOr<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(value: Guards<TC, TE, PTC>): value is GuardsOr<TC, TE, PTC> {
  return 'or' in value;
}

export function isGuardAnd<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(value: Guards<TC, TE, PTC>): value is GuardsAnd<TC, TE, PTC> {
  return 'and' in value;
}

export const guardJSONschema = z.object({
  id: z.string(),
  description: z.string().optional(),
});

const union = () => {
  return z.array(
    z.union([guardJSONschema, guardOrJSONschema, guardAndJSONschema]),
  );
};

export const guardOrJSONschema: z.ZodType<GuardsOr_JSON> = z.lazy(() =>
  z.object({
    or: union(),
  }),
);

export const guardAndJSONschema: z.ZodType<GuardsAnd_JSON> = z.lazy(() =>
  z.object({
    and: union(),
  }),
);

export const guardsJSONschema = z.union([
  guardJSONschema,
  z.array(guardJSONschema),
  guardOrJSONschema,
  guardAndJSONschema,
]);
