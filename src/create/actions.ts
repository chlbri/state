import { z } from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';
import {
  Action,
  Config,
  Definitions,
  EventObject,
  SingleOrArray,
  WithString,
} from '../Entities';
import { actionComplexSchema } from '../helpers';
import { Action_JSON } from '../Entities/Action';
import { collectTransitions } from './transitions';

export function collectActions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(values?: SingleOrArray<WithString<Action_JSON>>) {
  if (!values) return [];
  return z
    .union([
      actionComplexSchema.transform(values => [
        {
          ...values,
          libraryType: DEFAULT_TYPES.action,
        },
      ]),
      z.array(actionComplexSchema).transform(values =>
        values.map(values => ({
          ...values,
          libraryType: DEFAULT_TYPES.action,
        })),
      ),
      z
        .string()
        .transform(id => [{ id, libraryType: DEFAULT_TYPES.action }]),
      z
        .array(z.string())
        .transform(ids =>
          ids.map(id => ({ id, libraryType: DEFAULT_TYPES.action })),
        ),
    ])
    .parse(values) as Action<TC, TE, PTC>[];
}

export function assignActions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(actions: Action[], definitions?: Definitions<TC, TE, PTC>) {
  return actions.map(action => {
    action.exec = definitions?.actions?.[action.id];
    return action;
  }) as Action<TC, TE, PTC>[];
}

export function createActions<
  TC extends object = object,
  PTC extends object = object,
  TE extends EventObject = EventObject,
>(config: Config<TC, PTC>, definitions?: Definitions<TC, TE, PTC>) {
  const actions: Action<TC, TE, PTC>[] = [];
  const { transitions, remainActions } = collectTransitions<TC, TE, PTC>(
    config,
  );
  actions.push(...remainActions);
  transitions.forEach(transition => {
    const actionsFromTransition = transition.actions;
    if (actionsFromTransition) {
      const collectedActions = collectActions(actionsFromTransition);
      const assignedActions = assignActions(collectedActions, definitions);
      actions.push(...assignedActions);
    }
  });
  return actions;
}
