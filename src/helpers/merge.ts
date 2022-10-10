import { Transition } from '@-types';

function mergeTransitionsForSameEvent(
  findInOut: Transition,
  transition: Transition,
) {
  findInOut.guards.push(...transition.guards);
  findInOut.actions.push(...transition.actions);
  findInOut.target = transition.target;
  findInOut.description = transition.description;
}

export function mergeEvents(...transitions: Transition[]) {
  const out: Transition[] = [];
  transitions.forEach(transition => {
    const findInOut = out.find(
      ({ event }) => !!event && transition.event === event,
    );
    if (findInOut) {
      mergeTransitionsForSameEvent(findInOut, transition);
    } else {
      out.push(transition);
    }
  });
}
