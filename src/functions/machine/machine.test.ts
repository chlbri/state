import { createMachine } from './machine';

describe.concurrent('Acceptance', () => {
  test.concurrent('Function exists', () => {
    expect(createMachine).toBeDefined();
    expect(createMachine).toBeTypeOf('function');
  });

  const safe = () => {
    return createMachine({
      config: {
        context: { id: '' },
        children: { child1: {}, child2: {} },
        initial: 'child1',
      },
    });
  };
  test.concurrent('Return right object', () => {
    expect(safe).not.toThrowError();

    const received = safe();
    const expected = {
      initials: {
        context: { id: '' },
      },
      actions: [],
      promises: [],
      subscribables: [],
      guards: [],
      durations: [],
      nodes: [
        {
          events: [],
          type: 'compound',
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          id: '/',
          initial: 'child1',
          intervals: [],
          children: {
            child1: {
              type: 'atomic',
              events: [],
              now: [],
              after: [],
              promises: [],
              subscribables: [],
              intervals: [],
              id: '/child1',
              parentID: '/',
            },
            child2: {
              type: 'atomic',
              events: [],
              now: [],
              after: [],
              promises: [],
              subscribables: [],
              intervals: [],
              id: '/child2',
              parentID: '/',
            },
          },
        },
        {
          type: 'atomic',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1',
          parentID: '/',
        },
        {
          type: 'atomic',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child2',
          parentID: '/',
        },
      ],
    };

    expect(received).toEqual(expected);
  });
});
