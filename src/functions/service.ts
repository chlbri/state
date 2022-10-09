import { OBJECTS } from '@-constants';
import { getExecutable } from '@-helpers';
import { EventObject, ServicePromise, ServiceSubscribable } from '@-types';
import { z } from 'zod';
import { createTransition } from './transition';
import { CreateTransitionProps } from './_default';

export function createPromises<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  props: CreateTransitionProps<TC, TE, PTC> & {
    durationTransform: z.ZodUnion<
      [z.ZodNumber, z.ZodEffects<z.ZodString, string, string>]
    >;
  },
) {
  const _schema = z.object({
    timeout: props.durationTransform.optional(),
    description: z.string().optional(),
    then: createTransition<TC, TE, PTC>(props),
    catch: createTransition<TC, TE, PTC>(props),
    finally: props.actions,
  });

  const promises: ServicePromise<TC, TE, PTC>[] = [];

  const schema = z
    .record(z.string(), _schema)
    .optional()
    .transform(object => {
      if (!object) return promises;
      Object.entries(object).forEach(([src, promise]) => {
        const promiseToPush: ServicePromise<TC, TE, PTC> = {
          ...promise,
          src,
          libraryType: OBJECTS.DEFAULT_TYPES.service.object.promise,
          exec: getExecutable(props.definitions?.promises?.[src]),
        };

        promises.push(promiseToPush);
      });
      return promises;
    });
  return [promises, schema] as const;
}

export function createSubscribables<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props: CreateTransitionProps<TC, TE, PTC>) {
  const _schema = z.object({
    description: z.string().optional(),
    error: createTransition<TC, TE, PTC>(props),
    next: props.actions,
    complete: props.actions,
  });
  const subscribables: ServiceSubscribable<TE>[] = [];

  const schema = z
    .record(z.string(), _schema)
    .optional()
    .transform(object => {
      if (!object) return subscribables;
      Object.entries(object).forEach(([src, subscribable]) => {
        const subscribableToPush = {
          ...subscribable,
          src,
          libraryType: OBJECTS.DEFAULT_TYPES.service.object.subscribable,
          exec: getExecutable(props.definitions?.subcribables?.[src]),
        };

        subscribables.push(subscribableToPush);
      });
      return subscribables;
    });
  return [subscribables, schema] as const;
}
