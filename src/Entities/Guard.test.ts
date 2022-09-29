import { NOmit } from '@bemedev/core';
import { DEFAULT_TYPES } from '../constants/objects';
import { createGuard, Guard } from './Guard';

const common: NOmit<Guard, 'libraryType'> = {
  id: '',
  predicate: () => true,
};

describe.concurrent('Acceptance', () => {
  test.concurrent('Function exists', () => {
    expect(createGuard).toBeDefined();
    expect(createGuard).toBeTypeOf('function');
  });

  test.concurrent('It gets the "libraryType" property', () => {
    const actual = createGuard(common);
    expect(actual.libraryType).toBe(DEFAULT_TYPES.guard);
  });

  test.concurrent('It is defined', () => {
    const actual = createGuard(common);
    expect(actual).toBeDefined();
    expect(actual).toBeTypeOf('object');
  });
});
describe.concurrent('Simple', () => {
  // const actual = createGuard({ id: '', predicate: () => true });

  test.concurrent('It creates assertion', () => {
    const actual = createGuard(common);
    expect(actual.predicate).toBeDefined();
    expect(actual.predicate).toBeTypeOf('function');
    expect(actual.predicate()).toBe(true);
  });

  describe.concurrent('Assertion', () => {
    test.concurrent('Assertion is defined', () => {
      const predicate = createGuard(common).predicate;
      expect(predicate).toBeDefined();
      expect(predicate({ context: {} })).toBe(true);
    });

    test.concurrent(
      'Assertion 1 => <- predicate: () => true ->, return always "true"',
      () => {
        const predicate = createGuard(common).predicate;
        const actual = predicate({ context: { id: '1' } });
        expect(actual).toBe(true);
      },
    );

    test.concurrent(
      `Assertion 2 => : 
    predicate: (props: any) => props?.context?.bool === true :
    `,
      () => {
        const guard = createGuard({
          id: '',
          predicate: (props: any) => props?.context?.bool === true,
        });

        const predicate = guard.predicate;
        expect(predicate).toBeTypeOf('function');

        const actual1 = predicate({ context: { bool: true } });
        const actual2 = predicate({ context: { bool: false } });
        const actual3 = predicate({ context: { bool: '' } });
        const actual4 = predicate();

        expect(actual1).toBe(true);
        expect(actual2).toBe(false);
        expect(actual3).toBe(false);
        expect(actual4).toBe(false);
      },
    );
  });
});
