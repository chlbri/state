// import { EventObject, GuardPredicate, Guards_JSON, Props } from '../types';
// import { isGuardOr, isSimpleGuard } from './typeChecking';

// export function isGuardAnd(guards: Guards_JSON) {}

// /**
//  * Reduce the guards to one with a logical "or" : ||
//  * @param predicates
//  * @returns A guard
//  */
// export function reduceGuardsOr<
//   TC extends object = object,
//   TE extends EventObject = EventObject,
//   PTC extends object = object,
// >(
//   ...predicates: GuardPredicate<TC, TE, PTC>[]
// ): GuardPredicate<TC, TE, PTC> {
//   const out = (props?: Props<TC, TE, PTC>) => {
//     const results = predicates.map(predicate => predicate(props));
//     return results.some(result => result === true);
//   };
//   return out;
// }

// /**
//  * Reduce the guards to one with a logical "and" : &&
//  * @param predicates
//  * @returns A guard
//  */
// export function reduceGuardsAnd<
//   TC extends object = object,
//   TE extends EventObject = EventObject,
//   PTC extends object = object,
// >(...predicates: GuardPredicate<TC, TE, PTC>[]) {
//   const out = (props?: Props<TC, TE, PTC>) => {
//     const results = predicates.map(predicate => predicate(props));
//     return results.every(result => result === true);
//   };
//   return out;
// }

// /**
//  * Reduce guards recuresively.
//  * @param guards, Can get all type of guards
//  * @returns A guard
//  */
// export function reduceGuards<
//   TC extends object = object,
//   TE extends EventObject = EventObject,
//   PTC extends object = object,
// >(guards: Guards<TC, TE, PTC>): GuardPredicate<TC, TE, PTC> {
//   if (isSimpleGuard(guards)) {
//     return guards.predicate;
//   } else if (isGuardOr(guards)) {
//     const predicates = guards.or.map(reduceGuards);
//     return reduceGuardsOr(...predicates);
//   } else if (isGuardAnd(guards)) {
//     const predicates = guards.and.map(reduceGuards);
//     return reduceGuardsAnd(...predicates);
//   } else {
//     const predicates = guards.map(guard => guard.predicate);
//     return reduceGuardsAnd(...predicates);
//   }
// }
