import { z } from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';
import { getExecutableWithDescription } from '../helpers';
import { Definitions, Duration, EventObject } from '../types';

type DurationProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  src: string;
  description?: string;
  durations?: Definitions<TC, TE, PTC>['durations'];
};

export function transformDuration<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  src,
  description,
  durations,
}: DurationProps<TC, TE, PTC>): Duration<TC, TE, PTC> {
  const rest = getExecutableWithDescription(durations?.[src]);

  return {
    src,
    description,
    libraryType: DEFAULT_TYPES.duration,
    ...rest,
  };
}

export function createDuration<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(durations?: Definitions<TC, TE, PTC>['durations']) {
  const durationArray: Duration<TC, TE, PTC>[] = [];

  const transform = z.union([
    z.number() /* .max(MAXIMUM_DELAY).default(DEFAULT_DELAY) */,
    z.string().transform(src => {
      durationArray.push(transformDuration({ src, durations }));
      return src;
    }),
  ]);
  return [durationArray, transform] as const;
}
