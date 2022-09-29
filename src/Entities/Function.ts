import { EventObject } from './Event';
import { Props } from './Props';

export type FunctionMachine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = (props?: Props<TC, TE, PTC>) => any;

export type AsyncFunctionEvent<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = (props?: Props<TC, TE, PTC>) => Promise<any>;
