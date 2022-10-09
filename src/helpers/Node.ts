import type { MachineNode } from '@-types';

export function getNode(target: string, ...states: MachineNode[]) {
  const find = states.find(state => state.id === target);
  if (!find) throw new Error('State is not find in this machine');
  return find;
}
