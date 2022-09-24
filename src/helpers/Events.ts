import { EventEmit } from '../types';

export function compareEvents<T extends EventEmit>(
  first: T,
  value?: any,
): value is T {
  return !!value && value.event === first.event;
}
