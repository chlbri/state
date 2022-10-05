import { DEFAULT_TYPES } from '../constants/objects';
import { getExecutableWithDescription, isSingle } from '../helpers';
import {
  Definitions,
  EventObject,
  Guard,
  GuardUnion,
  JSONschema,
} from '../types';

export function transformGuards<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(values?: GuardUnion | GuardUnion[]) {
  const guards: Guard<TC, TE, PTC>[] = [];
  if (!values) return guards;
  if (isSingle(values)) {
    if (typeof values === 'string') {
      guards.push({ src: values, libraryType: DEFAULT_TYPES.guard });
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

  const transform = JSONschema.optional()
    .transform(transformGuards)
    .transform(values => {
      const defineds = values.map(value => {
        const rest = getExecutableWithDescription(
          definitions?.guards?.[value.src],
        );

        return {
          ...value,
          ...rest,
        };
      });
      guards.push(...defineds);
      return defineds.map(({ src }) => src);
    });

  return [guards, transform] as const;
}
