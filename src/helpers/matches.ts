import { decompose, StateValue } from '@bemedev/decompose';

export function matches(state: StateValue, value: string) {
  const values = decompose(state);
  return values.includes(value);
}
