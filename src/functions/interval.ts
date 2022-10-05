import { z } from 'zod';
import { MAXIMUM_DELAY, MINIMUM_INTERVAL } from '../constants/numbers';
import { EventObject, Interval, NOmit } from '../types';
import { addRemainActions } from './transition';
import { CreateTransitionProps } from './_default';

export function transformIntervals(
  values?: Record<string | number, NOmit<Interval, 'interval'>>,
) {
  const intervalArray: Interval[] = [];

  for (const interval in values) {
    if (Object.prototype.hasOwnProperty.call(values, interval)) {
      const intervalToPush = {
        ...values[interval],
        interval,
      };
      intervalArray.push(intervalToPush);
    }
  }

  return intervalArray;
}

export function createIntervals<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  actions,
  guards,
  durationTransform,
  remainActions,
  definitions,
}: CreateTransitionProps<TC, TE, PTC> & {
  durationTransform: z.ZodUnion<
    [z.ZodNumber, z.ZodEffects<z.ZodString, string, string>]
  >;
}) {
  const intervalArray: Interval[] = [];

  const delay = durationTransform
    .refine(value => {
      if (typeof value === 'number') return value <= MAXIMUM_DELAY;
      return true;
    })
    .optional();

  const intervalSchema: z.ZodType<
    NOmit<Interval, 'interval'>,
    z.ZodTypeDef,
    any
  > = z.object({
    actions,
    guards,
    delay,
  });

  function transformActions(
    actions: string[],
  ): NOmit<Interval, 'interval'> {
    addRemainActions({
      actions,
      remainActions,
      definitions: definitions?.actions,
    });
    return { actions, guards: [] };
  }

  const key = durationTransform.refine(value => {
    if (typeof value === 'number') return value >= MINIMUM_INTERVAL;
    return true;
  });

  const schema = z
    .record(
      key,
      z.union([
        z.string().transform<NOmit<Interval, 'interval'>>(action => ({
          actions: [action],
          guards: [],
        })),
        intervalSchema,
        z.string().array().transform(transformActions),
      ]),
    )
    .optional()
    .transform(values => {
      const valuesToPush = transformIntervals(values);
      intervalArray.push(...valuesToPush);
      return valuesToPush;
    });

  return [intervalArray, schema] as const;
}
