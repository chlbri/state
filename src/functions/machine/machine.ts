import { z } from 'zod';
import {
  Config_JSON,
  Definitions,
  EventObject,
  Settings,
} from '../../types';
import { transformNode } from '../node';
import { prepareMachine } from './prepare';
import { createSchema } from './schema';

type CreateMachineProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  config: Config_JSON<TC, PTC>;
  definitions?: Definitions<TC, TE, PTC>;
  settings?: Settings;
};

export function createMachine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  config: { context, privateContext, ...config },
  definitions,
}: CreateMachineProps<TC, TE, PTC>) {
  const {
    initials,
    arrays: { nodes, actions, guards, promises, subscribables, durations },
    transformers: {
      subscribableTransform,
      transitionTransform,
      promiseTransform,
      durationTransform,
      intervalTransform,
    },
  } = prepareMachine<TC, TE, PTC>(
    { context, privateContext },
    definitions,
  );

  const schema = createSchema<TC, TE, PTC>({
    durationTransform,
    promiseTransform,
    subscribableTransform,
    transitionTransform,
    intervalTransform,
  });

  schema
    .transform(node => {
      nodes.push(...transformNode(node));
    })
    .parse(config);

  type test = z.output<typeof schema>;

  return {
    actions,
    guards,
    initials,
    nodes,
    promises,
    subscribables,
    durations,
  } as const;
}
// TODO: mergeTransitons (from child to ancestors)
// TODO: mergePromises (from child to ancestors)
// TODO: mergeSubscribables (from child to ancestors)

// TODO: add settings : { priority :{ high?: array<string>, low?: array<string>, medium (default)?: array<string> }, immediates: array<string>, promiseTimeout?: number, interval?: number }

//For test
const create = createMachine({
  config: {
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
});

JSON.stringify(create.nodes, null, 2); //?
