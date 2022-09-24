import type { StateValue } from '@bemedev/decompose';
import type { EventObject } from './Event';

export type Props<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = {
  context?: TC;
  event?: TE;
  privateContext?: PTC;
};

export type PropsWithValue<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = Props<TC, TE, PTC> & {
  value: StateValue;
};
