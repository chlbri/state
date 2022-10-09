import type { ExecutableWithDescription, Subscribable } from '@-types';

export function executableHasDescription<
  Executable extends ((...args: any[]) => any) | Subscribable,
>(
  value?: ExecutableWithDescription<Executable>,
): value is {
  exec: Executable;
  description?: string;
} {
  if (!value) return false;
  return 'exec' in value;
}
