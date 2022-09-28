import { Actions, ACTIONS_TYPES } from './Action';
import { State } from './State';

describe.concurrent('Acceptance', () => {
  test.concurrent('Class exists', () => {
    expect(State).toBeTypeOf('function');
  });

  test.concurrent('Acceptance Properties', () => {
    const actual = new State({
      _id: '/',
      guards: {},
      actions: {},
      promises: {},
      values: [],
    });

    expect(actual.id).toBe('/');
  });
});

let state: State;

beforeAll(() => {
  state = new State({
    _id: '/',
    guards: {
      one: () => true,
      two: (props: any) => props?.context?.bool === true,
    },
    actions: {
      assign1: Actions.assign(() => ({})),
      assign2: Actions.assign(props => ({
        context: props?.context,
        privateContext: props?.privateContext,
      })),
      assign3: Actions.assign((props: any) => ({
        context: { id: props?.context?.id + '2' },
        privateContext: { details: 'details' },
      })),
    },
    promises: {},
    values: [],
  });
});

describe.concurrent('Guards', () => {
  describe.concurrent('Guard exists if "id" is defined', () => {
    describe.concurrent('one', () => {
      const guardGetter = () => state.getGuard('one');

      test.concurrent('Not throw', () => {
        expect(guardGetter).not.toThrow();
      });

      test.concurrent('context: { id: 1 } => true', () => {
        const guard = guardGetter();
        expect(guard.predicate({ context: { id: 1 } })).toBe(true);
      });

      test.concurrent('context: { id: 2 } => true', () => {
        const guard = guardGetter();
        expect(guard.predicate({ context: { id: 2 } })).toBe(true);
      });
    });

    describe.concurrent('two', () => {
      const guardGetter = () => state.getGuard('two');

      test.concurrent('Not throw', () => {
        expect(guardGetter).not.toThrow();
      });

      test.concurrent('context: undefined', () => {
        const guard = guardGetter();
        expect(guard.predicate()).toBe(false);
      });

      test.concurrent('context: { id: 1 } => false', () => {
        const guard = guardGetter();
        expect(guard.predicate({ context: { id: 1 } })).toBe(false);
      });

      test.concurrent('context: { bool: true } => true', () => {
        const guard = guardGetter();
        expect(guard.predicate({ context: { bool: true } })).toBe(true);
      });

      test.concurrent('context: { bool: false } => false', () => {
        const guard = guardGetter();
        expect(guard.predicate({ context: { bool: false } })).toBe(false);
      });
    });
  });

  test.concurrent('Not Exists in State', () => {
    const guardGetter = () => state.getGuard('not Exists in State');
    expect(guardGetter).toThrowError(State.ERRORS.guard);
  });

  test.concurrent('Undefined', () => {
    const guardGetter = () => state.getGuard(undefined);
    expect(guardGetter).toThrowError(State.ERRORS.id);
  });
});

describe.concurrent('Actions', () => {
  describe.concurrent('Guard exists if "id" is defined', () => {
    describe.concurrent('assign1', () => {
      const safe = () => state.getAction('assign1');

      test.concurrent('It exists', () => {
        expect(safe).not.throw();

        const _safe = safe();
        expect(_safe).toBeDefined();
        expect(_safe.exec).toBeTypeOf('function');
        expect(_safe.libraryType).toBe(ACTIONS_TYPES.assign);
      });

      test.concurrent('Assign1 => empty object', () => {
        const actual = safe().exec({ context: { id: 'uid' } });
        expect(actual).toEqual({});
      });
    });

    describe.concurrent('Assign2', () => {
      test.concurrent('Empty object ==> empty object', () => {
        const actual = state.getAction('assign2').exec();
        expect(actual).toEqual({});
      });

      test.concurrent('Assign2 => same object', () => {
        const actual = state
          .getAction('assign2')
          .exec({ context: { id: 'uid' } });
        expect(actual).toEqual({ context: { id: 'uid' } });
      });
    });

    describe.concurrent('Assign3', () => {
      test.concurrent('Empty object ==> default object', () => {
        const actual = state.getAction('assign3').exec();
        expect(actual).toEqual({
          context: { id: 'undefined2' },
          privateContext: { details: 'details' },
        });
      });

      test.concurrent(
        `
      { context: { id: 'uid' } }   ==>  
      { 
        context: { id: 'uid2' }, 
        privateContext: { details: 'details' 
      }`,
        () => {
          const exec = state.getAction('assign3').exec;
          const actual = exec({ context: { id: 'uid' } });
          expect(actual).toEqual({
            context: { id: 'uid2' },
            privateContext: { details: 'details' },
          });
        },
      );

      test.concurrent(
        `
      { context: { id: 'id' } }   ==>  
      { 
        context: { id: 'id2' }, 
        privateContext: { details: 'details' 
      }`,
        () => {
          const exec = state.getAction('assign3').exec;
          const actual = exec({ context: { id: 'id' } });
          expect(actual).toEqual({
            context: { id: 'id2' },
            privateContext: { details: 'details' },
          });
        },
      );
    });
  });

  test.concurrent('Not Exists in State', () => {
    const actionGetter = () => state.getAction('Not exists in State');
    expect(actionGetter).toThrowError(State.ERRORS.action);
  });

  test.concurrent('Undefined', () => {
    const actionGetter = () => state.getAction();
    expect(actionGetter).toThrowError(State.ERRORS.id);
  });
});
