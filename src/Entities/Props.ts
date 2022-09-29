import type { EventObject } from './Event';

export type Props<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  context?: TC;
  event?: TE;
  privateContext?: PTC;
};
