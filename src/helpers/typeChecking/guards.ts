import { DEFAULT_TYPES } from '../../constants/objects';
import {
  EventObject,
  Guard,
  Guards,
  GuardsAnd,
  GuardsOr,
} from '../../types';

export function isSimpleGuard<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
>(value: Guards<TC, TE, PTC>): value is Guard<TC, TE, PTC> {
  return (value as any).type === DEFAULT_TYPES.guard;
}

export function isGuardOr<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
>(value: Guards<TC, TE, PTC>): value is GuardsOr<TC, TE, PTC> {
  return 'or' in value;
}

export function isGuardAnd<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
>(value: Guards<TC, TE, PTC>): value is GuardsAnd<TC, TE, PTC> {
  return 'and' in value;
}
