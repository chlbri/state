import { Actions } from './Action';
import { Machine, MachineProps } from './Machine';
import { State } from './State';

describe.concurrent('Acceptance', () => {
  test.concurrent('Class exists', () => {
    expect(Machine).toBeDefined();
    expect(Machine).toBeTypeOf('function');
  });

  test.concurrent('Static members', () => {
    expect(Machine.defaultID).toBe('/');
    expect(Machine.ERRORS).toBeTypeOf('object');
    expect(Machine.ERRORS.id).toBeInstanceOf(Error);
  });

  describe.concurrent('Properties at construction', () => {
    test.concurrent(
      'States is empty, throw "Machine.ERRORS.master" at construction',
      () => {
        const props: MachineProps = {
          context: {
            id: '',
            data: {
              load: 'loading',
            },
          },
          privateContext: {
            id: '',
            data: {
              isAdmin: false,
            },
          },
          states: [],
        };
        const safe = () => new Machine(props);
        expect(safe).toThrowError(Machine.ERRORS.master);
      },
    );

    test.concurrent(
      'States not contains one with "Machine.defaultID", throw "Machine.ERRORS.master" at construction',
      () => {
        const props: MachineProps = {
          context: {
            id: '',
            data: {
              load: 'loading',
            },
          },
          privateContext: {
            id: '',
            data: {
              isAdmin: false,
            },
          },
          states: [
            new State({
              _id: 'notMaster',
              actions: {},
              guards: {},
              promises: {},
              values: [],
            }),
          ],
        };
        const safe = () => new Machine(props);
        expect(safe).toThrowError(Machine.ERRORS.master);
      },
    );

    test.concurrent(
      'States contains one with "Machine.defaultID", constructs object',
      () => {
        const masterState = new State({
          _id: Machine.defaultID,
          actions: {},
          guards: {},
          promises: {},
          values: [],
        });
        const props: MachineProps = {
          context: {
            id: '',
            data: {
              load: 'loading',
            },
          },
          privateContext: {
            id: '',
            data: {
              isAdmin: false,
            },
          },
          description: 'A dummy machine',
          states: [
            new State({
              _id: 'notMaster',
              actions: {},
              guards: {},
              promises: {},
              values: [],
            }),
            masterState,
          ],
        };
        const safe = () => new Machine(props);
        expect(safe).not.toThrow();
        const machine = safe();
        expect(machine.description).toBe('A dummy machine');
        expect(machine.initials).toEqual({
          context: {
            id: '',
            data: {
              load: 'loading',
            },
          },
          privateContext: {
            id: '',
            data: {
              isAdmin: false,
            },
          },
        });
      },
    );
  });
});

describe.concurrent('Functions', () => {
  const useTestMachine = () => {
    const master = new State({
      _id: Machine.defaultID,
      actions: {
        walk: Actions.assign(() => ({})),
      },
      guards: {},
      promises: {},
      values: [],
    });

    const state1 = new State({
      _id: 'employee',
      actions: {},
      guards: {},
      promises: {},
      values: [],
    });

    const props: MachineProps = {
      context: {
        id: '',
        data: {
          load: 'loading',
        },
      },
      privateContext: {
        id: '',
        data: {
          isAdmin: false,
        },
      },
      description: 'A dummy machine',
      states: [state1, master],
    };

    const machine = new Machine(props);

    return { machine, state1 };
  };

  describe.concurrent('Funtion "changeState"', () => {
    test.concurrent('Return error if the searchValue is undefined', () => {
      const { machine } = useTestMachine();
      const safe1 = () => machine.changeState();
      const safe2 = () => machine.changeState(undefined);
      expect(safe1).toThrowError(Machine.ERRORS.id);
      expect(safe2).toThrowError(Machine.ERRORS.id);
    });

    test.concurrent('Return error if prevState === nextState', () => {
      const { machine } = useTestMachine();
      const safe = () => machine.changeState(Machine.defaultID);
      expect(safe).toThrowError(Machine.ERRORS.state.same);
    });

    test.concurrent(
      'Return error if state not registered and keep master state',
      () => {
        const { machine } = useTestMachine();
        const safeState = () =>
          machine.changeState('State is not registered');
        expect(safeState).toThrowError(Machine.ERRORS.state.notFound);
        const safeAction = () => machine.performAction('walk');
        expect(safeAction).not.toThrow();
      },
    );

    test.concurrent('Return nextState if it is defined', () => {
      const { machine, state1 } = useTestMachine();
      const safeState = () => machine.changeState(state1.id);
      expect(safeState).not.toThrow();
      const actual = safeState();
      expect(actual).toBe(state1);
      const safeAction = () => machine.performAction('walk');
      expect(safeAction).toThrowError(State.ERRORS.action);
    });
  });
});
