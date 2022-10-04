import { Config_JSON, Definitions, EventObject } from '../../types';
import { transformNode } from '../node';
import { prepareMachine } from './prepare';
import { createSchema } from './schema';

export function createMachine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  { context, privateContext, ...config }: Config_JSON<TC, PTC>,
  definitions?: Definitions<TC, TE, PTC>,
) {
  const {
    initials,
    arrays: { nodes, actions, guards, promises, subscribables },
    transformers: {
      subscribableTransform,
      transitionTransform,
      promiseTransform,
    },
  } = prepareMachine({ context, privateContext }, definitions);

  const schema = createSchema({
    definitions,
    promiseTransform,
    subscribableTransform,
    transitionTransform,
  });

  schema
    .transform(node => {
      nodes.push(...transformNode(node));
    })
    .parse(config);

  return {
    actions,
    guards,
    initials,
    nodes,
    promises,
    subscribables,
  } as const;
}
// TODO: type EventExtend
// TODO: mergeTransitons (from child to ancestors)
// TODO: mergePromises (from child to ancestors)
// TODO: mergeSubscribables (from child to ancestors)
// TODO: add interval (only actions) : {delay? =0, interval? =defaultInterval, actions:string[] }
// TODO: add settings : { priority :{ high?: array<string>, low?: array<string>, medium (default)?: array<string> }, immediates: array<string>, promiseTimeout?: number, interval?: number }

//For test
const create = createMachine(
  {
    children: {
      child1: {
        events: {
          ok: { actions: ['dormir', 'manger'] },
        },
      },
      child2: {
        events: {
          ok: { actions: ['danser', 'jouer'] },
        },
        type: 'parallel',
        children: {
          grandChild1: {},
          grandChild2: {},
        },
      },
    },
    context: {},
    type: 'parallel',
  },
  {},
);

JSON.stringify(create.nodes, null, 2); //?
