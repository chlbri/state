import { z } from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';
import { baseSchema } from '../helpers/typeChecking/_default';
import type { EventObject } from './Event';
import type { Props } from './Props';
import type {
  BaseType,
  DefaultTypes,
  SingleOrArray,
  WithString,
} from './_default';

export type Out<TC extends object, PTC extends object> = {
  context?: TC;
  privateContext?: PTC;
  target?: string;
};

export type ActionDelay<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): number;
}['bivarianceHack'];

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): Out<TC, PTC>;
}['bivarianceHack'];

export interface Action<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  id: string;
  libraryType: DefaultTypes['action'];
  exec?: ActionFunction<TC, TE, PTC>;
}

export function createAction<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props?: SingleOrArray<WithString<Action_JSON>>) {
  const out: Action<TC, TE, PTC>[] = [];
  if (!props) return out;
  if (typeof props === 'string') {
    out.push({ libraryType: DEFAULT_TYPES.action, id: props });
  } else if (Array.isArray(props)) {
    props.forEach(prop => {
      out.push(...createAction<TC, TE, PTC>(prop));
    });
  } else {
    out.push({ ...props, libraryType: DEFAULT_TYPES.action });
  }
  return out;
}

export const actionJSONschema = baseSchema
  .omit({ libraryType: true })
  .extend({
    id: z.string(),
  });

const actionTransform = <
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>() =>
  z.union([
    z
      .string()
      .transform<Action<TC, TE, PTC>[]>(id => [
        { libraryType: DEFAULT_TYPES.action, id },
      ]),

    actionJSONschema.transform<Action<TC, TE, PTC>[]>(props => [
      { ...props, libraryType: DEFAULT_TYPES.action },
    ]),
    z.array(
      z.union([
        actionJSONschema.transform<Action<TC, TE, PTC>>(props => ({
          ...props,
          libraryType: DEFAULT_TYPES.action,
        })),
        z.string().transform<Action<TC, TE, PTC>>(id => ({
          libraryType: DEFAULT_TYPES.action,
          id,
        })),
      ]),
    ),
  ]);

function assign<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(assigner: ActionFunction<TC, TE, PTC>) {
  return { exec: assigner, libraryType: DEFAULT_TYPES.action };
}

export const Actions = {
  assign,
};

export type Action_JSON = {
  id: string;
  description?: string;
};
