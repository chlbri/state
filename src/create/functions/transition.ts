import { z } from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import { toArray } from '../../helpers';
import { toIdentity } from '../../helpers/identity';
import { EventObject, Transition, unionStringArray } from '../types';
import { CreateTransitionProps } from './_default';

export function createTransition<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  actions,
  guards,
  definitions,
  remainActions,
}: CreateTransitionProps<TC, TE, PTC>) {
  const schema = z.object({
    description: z.string().optional(),
    in: unionStringArray,
    actions,
    guards,
    target: z.string().optional(),
  });

  const transformTarget = (target?: string): Transition<TC, TE, PTC> => ({
    target,
    in: [],
    actions: [],
    guards: [],
  });

  const transformActions = (
    actions: string[],
  ): Transition<TC, TE, PTC> => {
    remainActions.push(
      ...actions.map(id => ({
        id,
        libraryType: DEFAULT_TYPES.action,
        predicate: definitions?.actions?.[id],
      })),
    );
    return {
      in: [],
      actions,
      guards: [],
    };
  };
  return z.union([
    schema.transform(value => toArray<Transition<TC, TE, PTC>>(value)),
    z.string().transform(transformTarget).transform(toArray),
    z.array(
      schema.transform(value =>
        toIdentity<Transition<TC, TE, PTC>>(value),
      ),
    ),
    z.array(z.string()).transform(transformActions).transform(toArray),
  ]);
}

export function createTransitionOptional<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  actions,
  guards,
  definitions,
  remainActions,
}: CreateTransitionProps<TC, TE, PTC>) {
  const schema = z.object({
    description: z.string().optional(),
    in: unionStringArray,
    actions,
    guards,
    target: z.string().optional(),
  });

  const transformTarget = (target?: string): Transition<TC, TE, PTC> => ({
    target,
    in: [],
    actions: [],
    guards: [],
  });

  const transformActions = (
    actions: string[],
  ): Transition<TC, TE, PTC> => {
    remainActions.push(
      ...actions.map(id => ({
        id,
        libraryType: DEFAULT_TYPES.action,
        predicate: definitions?.actions?.[id],
      })),
    );
    return {
      in: [],
      actions,
      guards: [],
    };
  };

  return z.union([
    schema.transform(value => toArray<Transition<TC, TE, PTC>>(value)),
    z.string().transform(transformTarget).transform(toArray),
    z.undefined().transform(() => []),
    z.array(
      schema.transform(value =>
        toIdentity<Transition<TC, TE, PTC>>(value),
      ),
    ),
    z.array(z.string()).transform(transformActions).transform(toArray),
  ]);
}
