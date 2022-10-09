import { Definitions, EventObject, MachineNode } from '@-types';
import { NOmit } from '@bemedev/core';
import { createAction } from '../action';
import { createDuration } from '../duration';
import { createGuard } from '../guard';
import { createIntervals } from '../interval';
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

  const [durations, durationTransform] = createDuration(
    definitions?.durations,
  );
  const [actions, actionTransform] = createAction(definitions);
  const [guards, guardTransform] = createGuard(definitions);
  const [promises, promiseTransform] = createPromises({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    durationTransform,
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

  const [intervals, intervalTransform] = createIntervals({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    durationTransform,
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
      durations,
      intervals,
    },
    transformers: {
      actionTransform,
      guardTransform,
      subscribableTransform,
      transitionTransform,
      promiseTransform,
      durationTransform,
      intervalTransform,
    },
  } as const;
}
