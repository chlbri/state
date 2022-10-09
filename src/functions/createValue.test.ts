import { NodeOutput } from '../types/output';
import { createStateValueFromID } from './createValue';

test.concurrent('work  1', () => {
  const actual = createStateValueFromID();
  expect(actual).toEqual({ '/': {} });
});

test.concurrent('work  3', () => {
  const id = '/child1';

  const nodes: NodeOutput[] = [
    {
      events: [],
      type: 'parallel',
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      id: '/',
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
  ];
  const actual = createStateValueFromID(id, ...nodes);
  expect(actual).toEqual({ '/': { child1: {}, child2: {} } });
});

test.concurrent('work  4', () => {
  const id = '/child1/grandChild1';

  const nodes: NodeOutput[] = [
    {
      events: [],
      type: 'parallel',
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      id: '/',
      intervals: [],
      children: {
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
        child1: {
          type: 'compound',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1',
          parentID: '/',
          initial: 'grandChild1',
          children: {
            grandChild1: {
              type: 'atomic',
              events: [],
              now: [],
              after: [],
              promises: [],
              subscribables: [],
              intervals: [],
              id: '/child1/grandChild1',
              parentID: '/child1',
            },
            grandChild2: {
              type: 'atomic',
              events: [],
              now: [],
              after: [],
              promises: [],
              subscribables: [],
              intervals: [],
              id: '/child1/grandChild2',
              parentID: '/child1',
            },
          },
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
      id: '/child2',
      parentID: '/',
    },
    {
      type: 'compound',
      events: [],
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      intervals: [],
      id: '/child1',
      parentID: '/',
      initial: 'grandChild1',
      children: {
        grandChild1: {
          type: 'atomic',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1/grandChild1',
          parentID: '/child1',
        },
        grandChild2: {
          type: 'atomic',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1/grandChild2',
          parentID: '/child1',
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
      id: '/child1/grandChild1',
      parentID: '/child1',
    },
    {
      type: 'atomic',
      events: [],
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      intervals: [],
      id: '/child1/grandChild2',
      parentID: '/child1',
    },
  ];
  const actual = createStateValueFromID(id, ...nodes);
  expect(actual).toEqual({ '/': { child1: 'grandChild1', child2: {} } });
});

test.concurrent('work  5', () => {
  const id = '/child1/grandChild2';

  const nodes: NodeOutput[] = [
    {
      events: [],
      type: 'parallel',
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      id: '/',
      intervals: [],
      children: {
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
        child1: {
          type: 'compound',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1',
          parentID: '/',
          initial: 'grandChild1',
          children: {
            grandChild1: {
              type: 'atomic',
              events: [],
              now: [],
              after: [],
              promises: [],
              subscribables: [],
              intervals: [],
              id: '/child1/grandChild1',
              parentID: '/child1',
            },
            grandChild2: {
              type: 'atomic',
              events: [],
              now: [],
              after: [],
              promises: [],
              subscribables: [],
              intervals: [],
              id: '/child1/grandChild2',
              parentID: '/child1',
            },
          },
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
      id: '/child2',
      parentID: '/',
    },
    {
      type: 'compound',
      events: [],
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      intervals: [],
      id: '/child1',
      parentID: '/',
      initial: 'grandChild1',
      children: {
        grandChild1: {
          type: 'atomic',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1/grandChild1',
          parentID: '/child1',
        },
        grandChild2: {
          type: 'atomic',
          events: [],
          now: [],
          after: [],
          promises: [],
          subscribables: [],
          intervals: [],
          id: '/child1/grandChild2',
          parentID: '/child1',
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
      id: '/child1/grandChild1',
      parentID: '/child1',
    },
    {
      type: 'atomic',
      events: [],
      now: [],
      after: [],
      promises: [],
      subscribables: [],
      intervals: [],
      id: '/child1/grandChild2',
      parentID: '/child1',
    },
  ];
  const actual = createStateValueFromID(id, ...nodes);
  expect(actual).toEqual({ '/': { child1: 'grandChild2', child2: {} } });
});
