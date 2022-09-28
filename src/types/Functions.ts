import { EventObject } from './Event';
import { Props } from './Props';

export type FunctionMachine<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = (props?: Props<TC, TE, PTC, PTE>) => any;

export type AsyncFunctionEvent<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = (props?: Props<TC, TE, PTC, PTE>) => Promise<any>;
