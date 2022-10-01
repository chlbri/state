import {
  atomicNodeSchema,
  compoundNodeSchema,
  parallelNodeSchema,
} from './Nodes';

describe.concurrent('isParallel', () => {
  const safeParallel = (value: any) => {
    return () => parallelNodeSchema.parse(value);
  };

  describe.concurrent('Not parallel', () => {
    test.concurrent('No property is not defined', () => {
      const actual = {};
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent('Property "type" is not defined', () => {
      const actual = { id: 'ID' };
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent('Property "type" is defined to another type', () => {
      const actual = { type: 'compound' };
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent(
      'Property "type" is defined to "parallel", Property "children" is not defined',
      () => {
        const actual = { type: 'parallel' };
        expect(safeParallel(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" is defined to "parallel", Property "children" is defined, but empty',
      () => {
        const actual = {
          type: 'parallel',
          children: {},
        };
        expect(safeParallel(actual)).toThrowError(
          'Children must be superior to 2',
        );
      },
    );

    test.concurrent(
      'Property "type" is defined to "parallel", Property "children" is defined, but only 1 child',
      () => {
        const actual = {
          type: 'parallel',
          children: {
            child: {},
          },
        };
        expect(safeParallel(actual)).toThrowError(
          'Children must be superior to 2',
        );
      },
    );

    test.concurrent(
      'Property "type" is defined to "parallel", Property "children" is defined and non-empty, but initial is defined',
      () => {
        const actual = {
          type: 'parallel',
          children: { child1: {}, child2: {} },
          initial: 'child1',
        };
        expect(safeParallel(actual)).toThrowError();
      },
    );
  });

  describe.concurrent('Is Parallel', () => {
    test.concurrent('With atomic children', () => {
      const actual = {
        type: 'parallel',
        children: { child1: {}, child2: {} },
      };
      const received = safeParallel(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With compound children', () => {
      const actual = {
        type: 'parallel',
        children: {
          child1: {
            initial: 'grandChild1',
            children: {
              grandChild1: {},
              grandChild2: {},
            },
          },
          child2: {},
        },
      };
      const received = safeParallel(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With nexted parallel children', () => {
      const actual = {
        type: 'parallel',
        children: {
          child1: {
            type: 'parallel',
            children: {
              grandChild1: {},
              grandChild2: {},
            },
          },
          child2: {},
        },
      };
      const received = safeParallel(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });
  });
});

describe.concurrent('Compound', () => {
  const safeCompound = (value: any) => {
    return () => compoundNodeSchema.parse(value);
  };

  describe.concurrent('Not Compound', () => {
    test.concurrent(
      'Property "type" is not defined to "compound", but not "children"',
      () => {
        const actual = { type: 'parallel' };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" is defined to "compound", but not "children"',
      () => {
        const actual = { type: 'compound' };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined, but "children" is empty',
      () => {
        const actual = { type: 'compound', children: {} };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" is defined to "parallel", Property "children" is defined, but only 1 child',
      () => {
        const actual = {
          children: {
            child: {},
          },
        };
        expect(safeCompound(actual)).toThrowError(
          'Children must be superior to 2',
        );
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined,"children" is not empty, but "initial" is not defined',
      () => {
        const actual = {
          type: 'compound',
          children: { child1: {}, child2: {} },
        };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined,"children" is not empty,"initial" is defined , but "intial" is not corresponded to "children" ids',
      () => {
        const actual = {
          type: 'compound',
          children: { child1: {}, child2: {} },
          initial: 'not child',
        };
        expect(safeCompound(actual)).toThrowError();
      },
    );
  });

  describe.concurrent('Is Compound', () => {
    test.concurrent(
      'Type is not defined, but children and initial are defined',
      () => {
        const actual = {
          initial: 'child1',
          children: { child1: {}, child2: {} },
        };
        const received = safeCompound(actual);

        expect(received).not.toThrowError();
        expect(received()).toEqual(actual);
      },
    );
    test.concurrent('With atomic children, type is defined', () => {
      const actual = {
        type: 'compound',
        initial: 'child1',
        children: { child1: {}, child2: {} },
      };
      const received = safeCompound(actual);

      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With compound children', () => {
      const actual = {
        children: {
          child1: {
            initial: 'grandChild1',
            children: {
              grandChild1: {},
              grandChild2: {},
            },
          },
          child2: {},
        },
        initial: 'child1',
      };
      const received = safeCompound(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With nested parallel children', () => {
      const actual = {
        children: {
          child1: {
            type: 'parallel',
            children: {
              grandChild1: {},
              grandChild2: {},
            },
          },
          child2: {},
        },
        initial: 'child2',
      };
      const received = safeCompound(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });
  });
});

describe.concurrent('Atomic', () => {
  const safeAtomic = (value: any) => {
    return () => atomicNodeSchema.parse(value);
  };

  describe.concurrent('Not Atomic', () => {
    test.concurrent('Parallel node', () => {
      const actual = {
        type: 'parallel',
        children: { child1: {}, child2: {} },
      };
      const received = safeAtomic(actual);
      expect(received).toThrowError();
    });

    test.concurrent('Compound node', () => {
      const actual = {
        initial: 'child1',
        children: { child1: {}, child2: {} },
      };
      const received = safeAtomic(actual);
      expect(received).toThrowError();
    });

    describe.concurrent('Atomic but errors', () => {
      test.concurrent('Children are defined', () => {
        const actual = {
          type: 'atomic',
          children: { child1: {}, child2: {} },
        };
        const received = safeAtomic(actual);
        expect(received).toThrowError();
      });

      test.concurrent('Events are not well defined', () => {
        const actual = {
          type: 'atomic',
          events: {
            data: 1,
          },
        };
        const received = safeAtomic(actual);
        expect(received).toThrowError();
      });

      test.concurrent('Now not well defined', () => {
        const actual = {
          type: 'atomic',
          now: 6,
        };
        const received = safeAtomic(actual);
        expect(received).toThrowError();
      });

      test.concurrent('After not well defined', () => {
        const actual = {
          type: 'atomic',
          events: {
            data: 'target',
          },
          after: 6,
        };
        const received = safeAtomic(actual);
        expect(received).toThrowError();
      });
    });
  });

  describe.concurrent('Is Atomic', () => {
    test.concurrent('No property is not defined', () => {
      const actual = {};
      const received = safeAtomic(actual);
      expect(received).not.toThrow();
      expect(received()).toEqual(actual);
    });

    test.concurrent(
      '"id" is the only defined property, "type" is defined to "atomic"',
      () => {
        const actual = {
          id: 'start',
          type: 'atomic',
          events: {
            data: 'target',
          },
          now: 'now',
          after: 'after',
        };
        const received = safeAtomic(actual);
        expect(received).not.toThrowError();
        expect(received()).toEqual(actual);
      },
    );

    test.concurrent('"description" is defined to undefined', () => {
      const actual = {
        description: undefined,
        events: {},
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('"id" and "description" are defined', () => {
      const actual = {
        id: 'id',
        description: 'A simple description',
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent(
      '"children" and "initial" are defined to "undefined"',
      () => {
        const actual = {
          description: 'A simple description',
          children: undefined,
          initial: undefined,
        };
        const received = safeAtomic(actual);
        expect(received).not.toThrowError();
        expect(received()).toEqual(actual);
      },
    );
  });
});
