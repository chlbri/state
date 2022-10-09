import { OBJECTS } from '@-constants';
import { getExecutableWithDescription, toArray } from '@-helpers';
import { Action, Definitions, EventObject, JSONschema } from '@-types';
import z from 'zod';

export function createAction<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(definitions?: Definitions<TC, TE, PTC>) {
  const actions: Action<TC, TE, PTC>[] = [];
  const pushString = (src: string) => {
    const rest = getExecutableWithDescription(definitions?.actions?.[src]);
    const action = {
      src,
      libraryType: OBJECTS.DEFAULT_TYPES.action,
      ...rest,
    };
    actions.push(action);
    return src;
  };

  const pushValues = (values: { description?: string; src: string }) => {
    const rest = getExecutableWithDescription(
      definitions?.actions?.[values.src],
    );
    const action = {
      ...values,
      libraryType: OBJECTS.DEFAULT_TYPES.action,
      ...rest,
    };
    actions.push(action);
    return action.src;
  };

  const transform = z.union([
    z.string().transform(pushString).transform(toArray),
    JSONschema.transform(pushValues).transform(toArray),
    z.undefined().transform(() => toArray<string>()),
    z.array(
      z.union([
        z.string().transform(pushString),
        JSONschema.transform(pushValues),
      ]),
    ),
  ]);

  return [actions, transform] as const;
}
