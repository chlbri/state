import { NOmit } from '@bemedev/core';
import { Definitions, EventObject, MachineNode } from '../../types';
import { createAction } from '../action';
import { createGuard } from '../guard';
import { createPromises, createSubscribables } from '../service';
import { createTransitionOptional } from '../transition';
import { createInitials } from './initials';

export function prepareMachine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(value: any, definitions?: Definitions<TC, TE, PTC>) {
  const initials = createInitials(value);
  const nodes: NOmit<MachineNode<TC, TE, PTC>, 'id'>[] = [];

  const [actions, actionTransform] = createAction(definitions);
  const [guards, guardTransform] = createGuard(definitions);
  const [promises, promiseTransform] = createPromises({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    definitions,
  });
  const [subscribables, subscribableTransform] = createSubscribables({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    definitions,
  });

  const transitionTransform = createTransitionOptional<TC, TE, PTC>({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    definitions,
  });

  return {
    initials,
    arrays: {
      nodes,
      actions,
      guards,
      promises,
      subscribables,
    },
    transformers: {
      actionTransform,
      guardTransform,
      subscribableTransform,
      transitionTransform,
      promiseTransform,
    },
  } as const;
}
