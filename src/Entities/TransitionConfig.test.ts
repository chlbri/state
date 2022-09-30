import { DEFAULT_TYPES } from '../constants/objects';
import {
  createTransitionConfigs,
  TransitionConfig,
} from './TransitionConfig';

describe.concurrent('Acceptance', () => {
  test.concurrent('Function exists', () => {
    expect(createTransitionConfigs).toBeDefined();
    expect(createTransitionConfigs).toBeTypeOf('function');
  });

  test.concurrent('It returns array', () => {
    const actual = createTransitionConfigs({});
    expect(actual).toBeInstanceOf(Array);
  });

  test.concurrent('It returns empty array, if undefined', () => {
    const actual = createTransitionConfigs();
    expect(actual.length).toBe(0);
  });
});

test.concurrent('Transition -> Target', () => {
  const actual = createTransitionConfigs({
    event1: 'idle',
    event2: 'off',
    event3: 'on',
  });
  const expected: TransitionConfig[] = [
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event1',
      transitions: [{ target: 'idle' }],
    },
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event2',
      transitions: [{ target: 'off' }],
    },
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event3',
      transitions: [{ target: 'on' }],
    },
  ];

  expect(actual).toEqual(expected);
});

test.concurrent('Transition -> Actions', () => {
  const actual = createTransitionConfigs({
    event1: ['eat', 'sleep'],
    event2: ['run', 'walk'],
  });

  const expected: TransitionConfig[] = [
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event1',
      transitions: [{ actions: ['eat', 'sleep'] }],
    },
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event2',
      transitions: [{ actions: ['run', 'walk'] }],
    },
  ];

  expect(actual).toEqual(expected);
});

test.concurrent('Transition -> Transition Object', () => {
  const actual = createTransitionConfigs({
    event1: { target: 'on', actions: ['eat', 'sleep'] },
    event2: { target: 'off', actions: 'walk' },
  });

  const expected: TransitionConfig[] = [
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event1',
      transitions: [{ actions: ['eat', 'sleep'], target: 'on' }],
    },
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event2',
      transitions: [{ actions: 'walk', target: 'off' }],
    },
  ];

  expect(actual).toEqual(expected);
});

test.concurrent('Transition -> Transition Array', () => {
  const actual = createTransitionConfigs({
    event1: [
      { target: 'on', actions: ['eat', 'sleep'], guards: 'isValid' },
      ['sing', 'scream'],
    ],
    event2: [
      ['cook', 'finance'],
      ['play', 'sing'],
    ],
    event3: {
      target: 'off',
      actions: 'walk',
      guards: ['isAdmin', 'isDev'],
    },
  });

  const expected: TransitionConfig[] = [
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event1',
      transitions: [
        { actions: ['eat', 'sleep'], target: 'on', guards: 'isValid' },
        { actions: ['sing', 'scream'] },
      ],
    },
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event2',
      transitions: [
        { actions: ['cook', 'finance'] },
        { actions: ['play', 'sing'] },
      ],
    },
    {
      libraryType: DEFAULT_TYPES.transitionConfig.options.byEvent,
      eventType: 'event3',
      transitions: [
        { actions: 'walk', target: 'off', guards: ['isAdmin', 'isDev'] },
      ],
    },
  ];

  expect(actual).toEqual(expected);
});
