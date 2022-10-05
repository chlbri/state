import { Subscribable } from '../types';
import { ExecutableWithDescription } from './../types/definitions';

export function getExecutable<
  Executable extends ((...args: any[]) => any) | Subscribable,
>(value?: ExecutableWithDescription<Executable>) {
  if (!value) return undefined;
  return 'exec' in value ? value.exec : value;
}

export function getExecutableWithDescription<
  Executable extends ((...args: any[]) => any) | Subscribable,
>(value?: ExecutableWithDescription<Executable>) {
  if (!value) return {};
  return 'exec' in value ? value : { exec: value };
}
