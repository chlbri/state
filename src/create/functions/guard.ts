import { DEFAULT_TYPES } from '../../constants/objects';
import { isSingle } from '../../helpers';
import { Definitions, EventObject, Guard, GuardUnion } from '../types';
import { guard_JSON } from '../types/json/guard';

export function transformGuards<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(values?: GuardUnion | GuardUnion[]) {
  const guards: Guard<TC, TE, PTC>[] = [];
  if (!values) return guards;
  if (isSingle(values)) {
    if (typeof values === 'string') {
      guards.push({ id: values, libraryType: DEFAULT_TYPES.guard });
    } else if ('and' in values) {
      values.and;
      guards.push(...transformGuards(values.and));
    } else if ('or' in values) {
      guards.push(...transformGuards(values.or));
    } else {
      guards.push({ ...values, libraryType: DEFAULT_TYPES.guard });
    }
    return guards;
  }
  values.forEach(value => {
    guards.push(...transformGuards(value));
  });
  return guards;
}

export function createGuard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(definitions?: Definitions<TC, TE, PTC>) {
  const guards: Guard<TC, TE, PTC>[] = [];

  const transform = guard_JSON
    .optional()
    .transform(transformGuards)
    .transform(values => {
      const defineds = values.map(value => ({
        ...value,
        predicate: definitions?.guards?.[value.id],
      }));
      guards.push(...defineds);
      return defineds.map(({ id }) => id);
    });

  return [guards, transform] as const;
}
