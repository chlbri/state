import { NodeJSON } from '../Entities/Node';

export function getNode(target: string, ...states: NodeJSON[]) {
  const find = states.find(state => state.id === target);
  if (!find) throw new Error('State is not find in this machine');
  return find;
}
