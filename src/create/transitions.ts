import {
  Action,
  createServicePromise,
  createServiceSubscribable,
  createTransition,
  EventObject,
  Node,
  ServicePromise,
  ServiceSubscribable,
  Transition,
} from '../Entities';
import { collectActions } from './actions';

export function collectTransitions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({ children, now, after, events, promises, subscribables }: Node) {
  const transitions: Transition[] = [];
  const remainActions: Action<TC, TE, PTC>[] = [];
  const promiseArray: ServicePromise<TC, TE, PTC>[] = [];
  const subscribableArray: ServiceSubscribable<TE>[] = [];

  if (now) transitions.push(...createTransition(now));
  if (after) transitions.push(...createTransition(after));

  if (events) {
    const _events = Object.entries(events);
    _events.forEach(([event, transition]) => {
      const _transtions = createTransition(transition).map(transition => {
        transition.event = event;
        return transition;
      });
      transitions.push(..._transtions);
    });
  }

  if (promises) {
    const entries = Object.entries(promises);
    entries.forEach(([src, { timeout, description, ...props }]) => {
      const then = createTransition(props.then);
      const _catch = createTransition(props.catch);
      transitions.push(...then, ..._catch);
      const collectedFinally = collectActions<TC, TE, PTC>(props.finally);
      remainActions.push(...collectedFinally);

      promiseArray.push(
        createServicePromise({
          src,
          then,
          catch: _catch,
          timeout,
          description,
          finally: collectedFinally,
        }),
      );
    });
  }
  if (subscribables) {
    const entries = Object.entries(subscribables);
    entries.forEach(([src, { error: _error, ...props }]) => {
      const error = createTransition(_error);
      transitions.push(...error);
      const complete = collectActions<TC, TE, PTC>(props.complete);
      remainActions.push(...complete);
      const next = collectActions<TC, TE, PTC>(props.next);
      remainActions.push(...next);

      subscribableArray.push(
        createServiceSubscribable<TC, TE, PTC>({
          src,
          error,
          complete,
          next,
        }),
      );
    });
  }

  if (children) {
    const _children = Object.values(children);
    _children.forEach(child => {
      const recursives = collectTransitions<TC, TE, PTC>(child);
      transitions.push(...recursives.transitions);
      remainActions.push(...recursives.remainActions);
      promiseArray.push(...recursives.promises);
      subscribableArray.push(...recursives.subscribables);
    });
  }

  return {
    transitions,
    remainActions,
    promises: promiseArray,
    subscribables: subscribableArray,
  } as const;
}
