import { EventEmit, State } from '../types';

export function getState<
  TC extends object,
  TE extends EventEmit,
  PTC extends object,
>(searchId: string, ...states: State<TC, TE, PTC>[]) {
  const find = states.find(state => {
    const id = state.id ?? state._id;
    return id === searchId;
  });

  if (!find) throw new Error('State is not find in this machine');
  return find;
}
