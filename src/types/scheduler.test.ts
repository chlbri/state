import { sleep } from '@bemedev/core';
import { Scheduler } from './scheduler';

test.concurrent('Class exists', () => {
  const actual = new Scheduler();
  expect(actual).toBeDefined();
  expect(actual).toBeInstanceOf(Scheduler);
});

test.concurrent(
  'Only create object, this object is not initialized',
  () => {
    const scheduler = new Scheduler();
    expect(scheduler.initialized).toBe(false);
  },
);

test.concurrent(
  'Initialisation without action, we have no performedActions, and length of current stack is "0"',
  () => {
    const scheduler = new Scheduler();
    scheduler.initialize();

    expect(scheduler.initialized).toBe(true);
    expect(scheduler.actionsPerformed).toBe(0);
  },
);

test.concurrent(
  `Initialisation with action, but we don't change deferEvents to "true", so we have no performedActions, and length of current stack is "0"`,
  () => {
    const scheduler = new Scheduler();
    scheduler.initialize(async () => console.log('Hello world!'));

    expect(scheduler.initialized).toBe(true);
    expect(scheduler.actionsPerformed).toBe(1);
  },
);

test.concurrent(
  `Initialisation with action, but we change deferEvents to "true", so we have performedActions, and length of current stack is "0"`,
  () => {
    const scheduler = new Scheduler({ deferEvents: true });
    scheduler.initialize(async () => console.log('Hello world!'));

    expect(scheduler.initialized).toBe(true);
    expect(scheduler.actionsPerformed).toBe(1);
  },
);

test.only.concurrent(
  `Initialisation with action and schedule another action, so we have 2 performedActions, and length of current stack is "0"`,
  async () => {
    // vi.useFakeTimers({});
    const scheduler = new Scheduler();
    scheduler.initialize(async () => console.log('Hello world!'));
    expect(scheduler.initialized).toBe(true);

    scheduler.schedule(async () => {
      await sleep(10);
      console.log('BRI');
    });

    await sleep(40);

    expect(scheduler.actionsPerformed).toBe(2);
  },
);

test.concurrent(`Check if error Action throws Error`, () => {
  const scheduler = new Scheduler();
  scheduler.initialize(async () => console.log('Hello world!'));
  expect(scheduler.initialized).toBe(true);
  expect(scheduler.actionsPerformed).toBe(1);
  const error = () =>
    scheduler.schedule(() => {
      throw 'eer';
    });
  expect(error).toThrow('eer');
});

test.concurrent(`Nothing is scheduled if action is undefined`, () => {
  const scheduler = new Scheduler();
  scheduler.initialize(async () => console.log('Hello world!'));
  expect(scheduler.initialized).toBe(true);
  expect(scheduler.actionsPerformed).toBe(1);

  scheduler.schedule();
  expect(scheduler.actionsPerformed).toBe(1);
});
