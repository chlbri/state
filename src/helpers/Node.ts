import { Node } from '../Entities/Node';

export function getNode(target: string, ...states: Node[]) {
  const find = states.find(state => state.id === target);
  if (!find) throw new Error('State is not find in this machine');
  return find;
}
