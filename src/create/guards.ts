import {
  Config,
  Definitions,
  EventObject,
  Guard,
  Guards_JSON,
} from '../Entities';
import { guardsJSONschema, transformGuards } from '../helpers';
import { collectTransitions } from './transitions';

export function collectGuards(values: Guards_JSON) {
  return guardsJSONschema.transform(transformGuards).parse(values);
}

export function assignGuards<
  TC extends object = object,
  PTC extends object = object,
  TE extends EventObject = EventObject,
>(guards: Guard[], definitions?: Definitions<TC, TE, PTC>) {
  return guards.map(guard => {
    guard.predicate = definitions?.guards?.[guard.id] as any;
    return guard;
  }) as Guard<TC, TE, PTC>[];
}

export function createGuards<
  TC extends object = object,
  PTC extends object = object,
  TE extends EventObject = EventObject,
>(config: Config<TC, PTC>, definitions?: Definitions<TC, TE, PTC>) {
  const guards: Guard<TC, TE, PTC>[] = [];
  const { transitions } = collectTransitions(config);
  transitions.forEach(transition => {
    const guardsFromTransition = transition.guards;
    if (guardsFromTransition) {
      const collectedGuards = collectGuards(guardsFromTransition);
      const assignedGuards = assignGuards(collectedGuards, definitions);
      guards.push(...assignedGuards);
    }
  });
  return guards;
}
