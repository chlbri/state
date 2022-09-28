import type { StateValue } from '@bemedev/decompose';
import type { EventObject } from './Event';

export type Props<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = {
  context?: TC;
  event?: TE;
  privateEvent?: PTE;
  privateContext?: PTC;
};

export type PropsWithValue<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = Props<TC, TE, PTC, PTE> & {
  value: StateValue;
};
