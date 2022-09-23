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
