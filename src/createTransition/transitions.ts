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
import { isSingle } from '../helpers';
import { collectActions } from './actions';

export function collectTransitions<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({ children, now, after, events, promises, subscribables }: Node) {
  const transitions: Transition[] = [];
  const remainActions: Action<TC, TE, PTC>[] = [];
  const _promises: ServicePromise<TC, TE, PTC>[] = [];
  const _subscribables: ServiceSubscribable<TE>[] = [];

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
    if (isSingle(promises)) {
      const src = promises.src;
      const then = createTransition(promises.then);
      const _catch = createTransition(promises.catch);
      const timeout = promises.timeout;
      const description = promises.description;
      const _finally = promises.finally;
      transitions.push(...then, ..._catch);
      if (_finally) remainActions.push(...collectActions(_finally));
      _promises.push(
        createServicePromise({
          src,
          then,
          catch: _catch,
          timeout,
          finally: _finally,
          description,
        }),
      );
      // TODO: Factorize
    } else {
      promises.forEach(promise => {
        const src = promise.src;
        const then = createTransition(promise.then);
        const _catch = createTransition(promise.catch);
        const timeout = promise.timeout;
        const description = promise.description;
        const _finally = promise.finally;
        transitions.push(...then, ..._catch);
        if (_finally) remainActions.push(...collectActions(_finally));
        _promises.push(
          createServicePromise({
            src,
            then,
            catch: _catch,
            timeout,
            finally: _finally,
            description,
          }),
        );
      });
    }
  }
  if (subscribables) {
    if (isSingle(subscribables)) {
      const src = subscribables.src;
      const error = createTransition(subscribables.error);
      const description = subscribables.description;
      const next = subscribables.next;
      const complete = subscribables.complete;
      transitions.push(...createTransition(subscribables.error));
      if (complete) remainActions.push(...collectActions(complete));
      if (next) remainActions.push(...collectActions(next));
      _subscribables.push(
        createServiceSubscribable({
          src,
          error,
          description,
          next,
          complete,
        }),
      );
    } else {
      subscribables.forEach(subscribable => {
        const src = subscribable.src;
        const error = createTransition(subscribable.error);
        const description = subscribable.description;
        const next = subscribable.next;
        const complete = subscribable.complete;
        transitions.push(...createTransition(subscribable.error));
        if (complete) remainActions.push(...collectActions(complete));
        if (next) remainActions.push(...collectActions(next));
        _subscribables.push(
          createServiceSubscribable({
            src,
            error,
            description,
            next,
            complete,
          }),
        );
      });
    }
  }

  if (children) {
    const _children = Object.values(children);
    _children.forEach(child => {
      const recursives = collectTransitions<TC, TE, PTC>(child);
      transitions.push(...recursives.transitions);
      remainActions.push(...recursives.remainActions);
    });
  }

  return { transitions, remainActions } as const;
}
