import z from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import { toArray } from '../../helpers';
import { Action, Definitions, EventObject, JSONschema } from '../types';

export function createAction<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(definitions?: Definitions<TC, TE, PTC>) {
  const actions: Action<TC, TE, PTC>[] = [];
  const pushString = (id: string) => {
    const action = {
      id,
      libraryType: DEFAULT_TYPES.action,
      exec: definitions?.actions?.[id],
    };
    actions.push(action);
    return id;
  };

  const pushValues = (values: { description?: string; id: string }) => {
    const action = {
      ...values,
      libraryType: DEFAULT_TYPES.action,
      exec: definitions?.actions?.[values.id],
    };
    actions.push(action);
    return action.id;
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
