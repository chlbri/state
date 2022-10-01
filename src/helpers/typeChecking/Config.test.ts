import { z, ZodUnion } from 'zod';
import { configSchema } from './Config';

describe.concurrent('Acceptance', () => {
  test.concurrent('Function exists', () => {
    expect(configSchema).toBeDefined();
    expect(configSchema).toBeTypeOf('function');
  });

  test.concurrent('Return a ZodSchema', () => {
    const actual = configSchema({}, {});
    expect(actual).toBeDefined();
    expect(actual).toBeInstanceOf(ZodUnion);
  });
});

let safeParse: (value: any) => () => any;

beforeAll(() => {
  const config = configSchema(
    {
      user: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        login: z.string(),
      }),
    },
    {
      iter: z.number(),
    },
  );

  safeParse = (value: any) => () => config.parse(value);
});

describe.concurrent('not Config, throws error', () => {
  test.concurrent('Empty object', () => {
    const actual = {};
    const received = safeParse(actual);

    expect(received).toThrowError();
  });

  test.concurrent('context is not defined', () => {
    const actual = {
      privateContext: {
        iter: 0,
      },
    };
    const received = safeParse(actual);

    expect(received).toThrowError();
  });

  test.concurrent('context is not well defined', () => {
    const actual = {
      privateContext: {
        iter: 0,
      },
      context: {
        user: {
          login: undefined,
          firstName: 'Charles-Lévi',
        },
      },
    };
    const received = safeParse(actual);

    expect(received).toThrowError();
  });

  test.concurrent(
    'context is well defined, but private not well defined',
    () => {
      const actual = {
        privateContext: {
          noProperty: 0,
        },
        context: {
          user: {
            login: 'chlbri',
          },
        },
        initial: 'child1',
        children: {
          child1: {},
          child2: {},
        },
      };
      const received = safeParse(actual);

      expect(received).toThrowError();
    },
  );

  test.concurrent('context is well defined, but atomic', () => {
    const actual1 = {
      privateContext: {
        iter: 0,
      },
      context: {
        user: {
          login: 'chlbri',
        },
      },
    };

    const actual2 = {
      privateContext: {
        iter: 0,
      },
      context: {
        user: {
          login: 'chlbri',
        },
      },
      description: 'is Atomic',
      type: 'atomic',
    };

    const received1 = safeParse(actual1);
    const received2 = safeParse(actual2);

    expect(received1).toThrowError();
    expect(received2).toThrowError();
  });
});

describe.concurrent('is Config', () => {
  test.concurrent('context is well defined, and compound', () => {
    const actual = {
      privateContext: {
        iter: 0,
      },
      context: {
        user: {
          login: 'chlbri',
        },
      },
      initial: 'child1',
      children: {
        child1: {},
        child2: {},
      },
    };
    const received = safeParse(actual);

    expect(received).not.toThrow();
    expect(received()).toEqual(actual);
  });

  test.concurrent('context is well defined, and parallel', () => {
    const actual = {
      privateContext: {
        iter: 0,
      },
      context: {
        user: {
          login: 'chlbri',
        },
      },
      type: 'parallel',
      children: {
        child1: {},
        child2: {},
      },
    };
    const received = safeParse(actual);

    expect(received).not.toThrow();
    expect(received()).toEqual(actual);
  });
});
