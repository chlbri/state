import { NOmit } from '@bemedev/core';
import z, { Primitive } from 'zod';
import { DEFAULT_TYPES } from '../constants/objects';
import {
  DefaultTypes,
  Definitions,
  EventObject,
  JSONschema,
  Out,
  Props,
  Tarray,
  ZodTarray,
} from '../Entities';
import { guardsJSONschema, transformGuards } from '../helpers';
import { toIdentity } from '../helpers/identity';
import { toArray } from '../helpers/toArray';
import { DEFAULT_STATE_DELIMITER } from './../constants/strings';
import { BaseType } from './default';
import { Config_JSON, Node_JSON } from './json';
import {
  Node,
  ServicePromise,
  ServiceSubscribable,
  Transition,
} from './output';

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): Out<TC, PTC>;
}['bivarianceHack'];

export interface Action<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  id: string;
  libraryType: DefaultTypes['action'];
  exec?: ActionFunction<TC, TE, PTC>;
}

export type GuardPredicate<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = (props?: Props<TC, TE, PTC>) => boolean;

export interface Guard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> extends BaseType {
  libraryType: DefaultTypes['guard'];
  id: string;
  predicate?: GuardPredicate<TC, TE, PTC>;
}

export function createAction<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(definitions?: Definitions<TC, TE, PTC>) {
  const actions: Action<TC, TE, PTC>[] = [];
  const pushString = (id: string) => {
    const action = {
      id,
      libraryType: DEFAULT_TYPES.action,
      exec: definitions?.actions?.[id],
    };
    actions.push(action);
    return id;
  };

  const pushValues = (values: { description?: string; id: string }) => {
    const action = {
      ...values,
      libraryType: DEFAULT_TYPES.action,
      exec: definitions?.actions?.[values.id],
    };
    actions.push(action);
    return action.id;
  };

  const transform = z.union([
    z.string().transform(pushString).transform(toArray),
    JSONschema.transform(pushValues).transform(toArray),
    z.undefined().transform(() => toArray<string>()),
    z.array(
      z.union([
        z.string().transform(pushString),
        JSONschema.transform(pushValues),
      ]),
    ),
  ]);

  return [actions, transform] as const;
}

export function createGuard<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(definitions?: Definitions<TC, TE, PTC>) {
  const guards: Guard<TC, TE, PTC>[] = [];

  const transform = guardsJSONschema
    .optional()
    .transform(transformGuards)
    .transform(values => {
      const defineds = values.map(value => ({
        ...value,
        predicate: definitions?.guards?.[value.id],
      }));
      guards.push(...defineds);
      return defineds.map(({ id }) => id);
    });

  return [guards, transform] as const;
}

export const unionSA = z.union([
  z.string().optional().transform(toArray),
  z.array(z.string()),
]);

type CreateTransitionProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  remainActions: Action<TC, TE, PTC>[];
  actions: z.ZodType<string[], z.ZodTypeDef, any>;
  guards: z.ZodType<string[], z.ZodTypeDef, any>;
  definitions?: Definitions<TC, TE, PTC>;
};

export function createTransition<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  actions,
  guards,
  definitions,
  remainActions,
}: CreateTransitionProps<TC, TE, PTC>) {
  const schema = z.object({
    description: z.string().optional(),
    in: unionSA,
    actions,
    guards,
    target: z.string().optional(),
  });

  const transformTarget = (target?: string): Transition<TC, TE, PTC> => ({
    target,
    in: [],
    actions: [],
    guards: [],
  });

  const transformActions = (
    actions: string[],
  ): Transition<TC, TE, PTC> => {
    remainActions.push(
      ...actions.map(id => ({
        id,
        libraryType: DEFAULT_TYPES.action,
        predicate: definitions?.actions?.[id],
      })),
    );
    return {
      in: [],
      actions,
      guards: [],
    };
  };
  return z.union([
    schema.transform(value => toArray<Transition<TC, TE, PTC>>(value)),
    z.string().transform(transformTarget).transform(toArray),
    z.array(
      schema.transform(value =>
        toIdentity<Transition<TC, TE, PTC>>(value),
      ),
    ),
    z.array(z.string()).transform(transformActions).transform(toArray),
  ]);
}

export function createTransitionOptional<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>({
  actions,
  guards,
  definitions,
  remainActions,
}: CreateTransitionProps<TC, TE, PTC>) {
  const schema = z.object({
    description: z.string().optional(),
    in: unionSA,
    actions,
    guards,
    target: z.string().optional(),
  });

  const transformTarget = (target?: string): Transition<TC, TE, PTC> => ({
    target,
    in: [],
    actions: [],
    guards: [],
  });

  const transformActions = (
    actions: string[],
  ): Transition<TC, TE, PTC> => {
    remainActions.push(
      ...actions.map(id => ({
        id,
        libraryType: DEFAULT_TYPES.action,
        predicate: definitions?.actions?.[id],
      })),
    );
    return {
      in: [],
      actions,
      guards: [],
    };
  };

  return z.union([
    schema.transform(value => toArray<Transition<TC, TE, PTC>>(value)),
    z.string().transform(transformTarget).transform(toArray),
    z.undefined().transform(() => []),
    z.array(
      schema.transform(value =>
        toIdentity<Transition<TC, TE, PTC>>(value),
      ),
    ),
    z.array(z.string()).transform(transformActions).transform(toArray),
  ]);
}

export function createEvents<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  schema: z.ZodType<
    NOmit<Transition<TC, TE, PTC>, 'event'>[],
    z.ZodTypeDef,
    any
  >,
) {
  const mapper = (
    object?: Record<string, NOmit<Transition, 'event'>[]>,
  ) => {
    const out: Transition<TC, TE, PTC>[] = [];
    if (!object) return out;
    Object.entries(object).forEach(([event, transitions]) => {
      transitions.forEach(transition =>
        out.push({
          ...transition,
          event,
        }),
      );
    });

    return out;
  };

  return z.record(schema).optional().transform(mapper);
}

export function isNumber(value: string) {
  return /[0-9]*/.test(value);
}

export function createDelay<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(delay: string, definitions?: Definitions<TC, TE, PTC>) {
  return isNumber(delay)
    ? () => Number.parseInt(delay)
    : definitions?.delays?.[delay];
}

export function createAfter<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  schema: z.ZodType<Transition<TC, TE, PTC>[], z.ZodTypeDef, any>,
  definitions?: Definitions<TC, TE, PTC>,
) {
  const mapper = (object?: Record<string | number, Transition[]>) => {
    const out: Transition<TC, TE, PTC>[] = [];

    if (!object) return out;
    Object.entries(object).forEach(([_delay, transitions]) => {
      const delay = createDelay(_delay, definitions);

      transitions.forEach(transition => {
        out.push({
          ...transition,
          delay,
        });
      });
    });

    return out;
  };

  return z
    .record(z.union([z.number(), z.string()]), schema)
    .optional()
    .transform(mapper);
}

export function createZodStringLiterals<T extends Primitive>(
  ...values: Tarray<T>
) {
  return z
    .union(values.map(value => z.literal(value)) as ZodTarray<T>)
    .optional();
}

export const compoundNodeLengthError = {
  message: 'Initial must be one child',
};

export function childrenIdsIncludeInitial(data: any) {
  const initial = data.initial;
  const ids = Object.keys(data.children);
  return ids.includes(initial);
}

export const objectIsNotEmpty = (data: object) => {
  const keys = Object.keys(data);
  return keys.length > 1;
};

export function createPromises<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props: CreateTransitionProps<TC, TE, PTC>) {
  const _schema = z.object({
    timeout: z.number(),
    description: z.string().optional(),
    then: createTransition<TC, TE, PTC>(props),
    catch: createTransition<TC, TE, PTC>(props),
    finally: props.actions,
  });
  const promises: ServicePromise<TC, TE, PTC>[] = [];

  const schema = z
    .record(z.string(), _schema)
    .optional()
    .transform(object => {
      if (!object) return promises;
      Object.entries(object).forEach(([src, promise]) => {
        promises.push({
          ...promise,
          src,
          libraryType: DEFAULT_TYPES.service.object.promise,
          exec: props.definitions?.promises?.[src],
        });
      });
      return promises;
    });
  return [promises, schema] as const;
}

export function createSubscribables<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(props: CreateTransitionProps<TC, TE, PTC>) {
  const _schema = z.object({
    description: z.string().optional(),
    error: createTransition<TC, TE, PTC>(props),
    next: props.actions,
    complete: props.actions,
  });
  const subscribables: ServiceSubscribable<TE>[] = [];

  const schema = z
    .record(z.string(), _schema)
    .optional()
    .transform(object => {
      if (!object) return subscribables;
      Object.entries(object).forEach(([src, subscribable]) => {
        subscribables.push({
          ...subscribable,
          src,
          libraryType: DEFAULT_TYPES.service.object.subscribable,
          exec: props.definitions?.subcribables?.[src],
        });
      });
      return subscribables;
    });
  return [subscribables, schema] as const;
}

export function transformNodeChildren<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(children?: object) {
  const nodes: Node<TC, TE, PTC>[] = [];
  if (!children) return nodes;

  Object.entries(children).forEach(([childID, node]) => {
    nodes.push(
      ...transformNode(
        { ...node, children: node.children ?? [] },
        childID,
      ),
    );
  });

  return nodes;
}

export function transformNode<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(node?: any, id: string = DEFAULT_STATE_DELIMITER, parentID?: string) {
  const nodes: Node<TC, TE, PTC>[] = [];
  if (!node) return nodes;
  const children = node.children;

  nodes.push({
    ...node,
    parentID,
    id,
    // children: transformNodeChildren(children),
  });
  if (children) {
    Object.entries(children).forEach(([_childID, node]) => {
      const childID = `${id}${
        id === DEFAULT_STATE_DELIMITER ? '' : '/'
      }${_childID}`;
      nodes.push(...transformNode(node, childID, id));
    });
  }
  return nodes;
}

export function createMachine<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  { context, privateContext, ...config }: Config_JSON<TC, PTC>,
  definitions?: Definitions<TC, TE, PTC>,
) {
  const initials = { context, privateContext } as const;
  const nodes: NOmit<Node<TC, TE, PTC>, 'id'>[] = [];

  const [actions, actionTransform] = createAction(definitions);
  const [guards, guardTransform] = createGuard(definitions);
  const [promises, promiseTransform] = createPromises({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    definitions,
  });
  const [subscribables, subscribableTransform] = createSubscribables({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    definitions,
  });

  const transitionTransform = createTransitionOptional<TC, TE, PTC>({
    actions: actionTransform,
    guards: guardTransform,
    remainActions: actions,
    definitions,
  });

  const nodeSchema: z.ZodType<
    NOmit<Node<TC, TE, PTC>, 'id'>,
    z.ZodTypeDef,
    Node_JSON
  > = z.lazy(() =>
    z.union([parallelNodeSchema, compoundNodeSchema, atomicNodeSchema]),
  );

  const children = z.record(nodeSchema).refine(objectIsNotEmpty, {
    message: 'Children must be superior to 2',
  });
  // .transform(transformNodeChildren);

  const common = z
    .object({
      parentID: z.string().optional(),
      id: z.string().optional(),
      description: z.string().optional(),
      delimiter: z.string().default(DEFAULT_STATE_DELIMITER).optional(),
      events: createEvents<TC, TE, PTC>(transitionTransform),
      // type: createZodStringLiterals(...DEFAULT_TYPES.node.types.array),
      now: transitionTransform,
      after: createAfter(transitionTransform, definitions),
      promises: promiseTransform,
      subscribables: subscribableTransform,
    })
    .strict();

  const parallelNodeSchema = common
    .extend({
      type: z.literal(DEFAULT_TYPES.node.types.object.parallel),
      initial: z.undefined().optional(),
      children,
    })
    .strict();


  const compoundNodeSchema = common
    .extend({
      initial: z.string(),
      children,
      type: z
        .literal(DEFAULT_TYPES.node.types.object.compound)
        .default(DEFAULT_TYPES.node.types.object.compound),
    })
    .strict()
    .refine(childrenIdsIncludeInitial, compoundNodeLengthError);

  const atomicNodeSchema = common
    .extend({
      initial: z.undefined().optional(),
      children: z.undefined().optional(),
      type: z
        .literal(DEFAULT_TYPES.node.types.object.atomic)
        .default(DEFAULT_TYPES.node.types.object.atomic),
    })
    .strict();

  z.union([compoundNodeSchema, parallelNodeSchema])
    .transform(value => {
      nodes.push(...transformNode(value));
    })
    .parse(config);

  return {
    guards,
    actions,
    promises,
    subscribables,
    initials,
    nodes,
  } as const;
}

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
