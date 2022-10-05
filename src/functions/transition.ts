import { z } from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';
import { toArray } from '../helpers';
import { toIdentity } from '../helpers/identity';
import {
  Action,
  Definitions,
  EventObject,
  Transition,
  unionStringArray,
} from '../types';
import { CreateTransitionProps } from './_default';

export function transformTarget(target: string): Transition {
  return {
    target,
    in: [],
    actions: [],
    guards: [],
  };
}

type AddRemainActionProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  definitions?: Definitions<TC, TE, PTC>['actions'];
  remainActions: Action<TC, TE, PTC>[];
  actions: string[];
};

export function addRemainActions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  actions,
  remainActions,
  definitions,
}: AddRemainActionProps<TC, TE, PTC>) {
  remainActions.push(
    ...actions.map(src => ({
      src,
      libraryType: DEFAULT_TYPES.action,
      predicate: definitions?.[src],
    })),
  );
}

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

  function transformActions(actions: string[]): Transition {
    addRemainActions({
      actions,
      remainActions,
      definitions: definitions?.actions,
    });
    return {
      in: [],
      actions,
      guards: [],
    };
  }

  const out = z.union([
    schema.transform(value => toArray<Transition>(value)),
    z.string().transform(transformTarget).transform(toArray),
    z.array(schema.transform(value => toIdentity<Transition>(value))),
    z.array(z.string()).transform(transformActions).transform(toArray),
  ]);
  return out;
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

  function transformActions(actions: string[]): Transition {
    addRemainActions({
      actions,
      remainActions,
      definitions: definitions?.actions,
    });
    return {
      in: [],
      actions,
      guards: [],
    };
  }

  return z.union([
    schema.transform(value => toArray<Transition>(value)),
    z.string().transform(transformTarget).transform(toArray),
    z.undefined().transform(() => []),
    z.array(schema.transform(value => toIdentity<Transition>(value))),
    z.array(z.string()).transform(transformActions).transform(toArray),
  ]);
}
