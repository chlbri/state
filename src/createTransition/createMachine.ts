import { Action, Config, Definitions, EventObject } from '../Entities';
import { collectTransitions } from './transitions';



export function createPromises<
  TC extends object = object,
  PTC extends object = object,
  TE extends EventObject = EventObject,
>(config: Config<TC, PTC>, definitions?: Definitions<TC, TE, PTC>) {}

export function createSubscribables<
  TC extends object = object,
  PTC extends object = object,
  TE extends EventObject = EventObject,
>(config: Config<TC, PTC>, definitions?: Definitions<TC, TE, PTC>) {}

export function createMachine<
  TC extends object = object,
  PTC extends object = object,
  TE extends EventObject = EventObject,
>(config: Config<TC, PTC>, definitions?: Definitions<TC, TE, PTC>) {
  // TODO :  Build the Function
}
