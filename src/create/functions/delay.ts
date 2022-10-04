import { isNumber } from '../../helpers';
import { Definitions, EventObject } from '../types';

export function createDelay<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(delay: string, definitions?: Definitions<TC, TE, PTC>) {
  return isNumber(delay)
    ? () => Number.parseInt(delay)
    : definitions?.durations?.[delay];
}
