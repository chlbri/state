import { z } from 'zod';
import { DEFAULT_TYPES } from '../../constants/objects';
import {
  EventObject,
  ServicePromise,
  ServiceSubscribable,
} from '../types';
import { createTransition } from './transition';
import { CreateTransitionProps } from './_default';

export function createPromises<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props: CreateTransitionProps<TC, TE, PTC>) {
  const _schema = z.object({
    timeout: z.number(),
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
        promises.push({
          ...promise,
          src,
          libraryType: DEFAULT_TYPES.service.object.promise,
          exec: props.definitions?.promises?.[src],
        });
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
        subscribables.push({
          ...subscribable,
          src,
          libraryType: DEFAULT_TYPES.service.object.subscribable,
          exec: props.definitions?.subcribables?.[src],
        });
      });
      return subscribables;
    });
  return [subscribables, schema] as const;
}
