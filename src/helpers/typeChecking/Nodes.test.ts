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
      const actual = { _id: 'ID' };
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent('Property "type" is defined to another type', () => {
      const actual = { _id: 'ID', type: 'compound' };
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent('Property "children" is not defined', () => {
      const actual = { _id: 'ID', type: 'parallel' };
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent('Property "children" is defined, but empty', () => {
      const actual = {
        _id: 'ID',
        type: 'parallel',
        children: [],
      };
      expect(safeParallel(actual)).toThrowError();
    });

    test.concurrent('Property "promise" is defined', () => {
      const actual = {
        _id: 'ID',
        type: 'parallel',
        children: [{ _id: 'child1' }, { _id: 'child2' }],
        promise: '',
      };
      expect(safeParallel(actual)).toThrowError();
    });
  });

  describe.concurrent('Is Parallel', () => {
    test.concurrent('With atomic children', () => {
      const actual = {
        _id: 'ID',
        type: 'parallel',
        children: [{ _id: 'child1' }, { _id: 'child2' }],
      };
      const received = safeParallel(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With compound children', () => {
      const actual = {
        _id: 'ID',
        type: 'parallel',
        children: [
          {
            _id: 'child1',
            children: [{ _id: 'grandChild1' }, { _id: 'grandChild2' }],
            initial: 'grandChild1',
          },
          { _id: 'child2' },
        ],
      };
      const received = safeParallel(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With nexted parallel children', () => {
      const actual = {
        _id: 'ID',
        type: 'parallel',
        children: [
          {
            _id: 'child1',
            children: [{ _id: 'grandChild1' }, { _id: 'grandChild2' }],
            type: 'parallel',
          },
          { _id: 'child2' },
        ],
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
      'Property "type" and "children" are not defined,',
      () => {
        const actual = { _id: 'ID' };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" is not defined to "compound", but not "children"',
      () => {
        const actual = { _id: 'ID', type: 'parallel' };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" is defined to "compound", but not "children"',
      () => {
        const actual = { _id: 'ID', type: 'compound' };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined, but not "children" is empty',
      () => {
        const actual = { _id: 'ID', type: 'compound', children: [] };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined,"children" is not empty, but "initial" is not defined',
      () => {
        const actual = {
          _id: 'ID',
          type: 'compound',
          children: [{ _id: 'child1' }, { _id: 'child2' }],
        };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined,"children" is not empty,"initial" is defined , but "intial" is not corresponded to "children" ids',
      () => {
        const actual = {
          _id: 'ID',
          type: 'compound',
          children: [{ _id: 'child1' }, { _id: 'child2' }],
          initial: 'not child',
        };
        expect(safeCompound(actual)).toThrowError();
      },
    );

    test.concurrent(
      'Property "type" and "children" are defined,"children" is not empty,"initial" is defined , but "intial" corresponds to "children" ids, but "promise" is defined',
      () => {
        const actual = {
          _id: 'ID',
          type: 'compound',
          children: [{ _id: 'child1' }, { _id: 'child2' }],
          initial: 'child1',
          promise: '',
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
          _id: 'ID',
          initial: 'child1',
          children: [{ _id: 'child1' }, { _id: 'child2' }],
        };
        const received = safeCompound(actual);

        expect(received).not.toThrowError();
        expect(received()).toEqual(actual);
      },
    );
    test.concurrent('With atomic children, type is defined', () => {
      const actual = {
        _id: 'ID',
        type: 'compound',
        initial: 'child1',
        children: [{ _id: 'child1' }, { _id: 'child2' }],
      };
      const received = safeCompound(actual);

      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent('With compound children', () => {
      const actual = {
        _id: 'ID',
        children: [
          {
            _id: 'child1',
            children: [{ _id: 'grandChild1' }, { _id: 'grandChild2' }],
            initial: 'grandChild1',
          },
          { _id: 'child2' },
        ],
        initial: 'child1',
      };
      const received = safeCompound(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test.concurrent(
      'With nexted parallel children, "promise" is defined to undefined',
      () => {
        const actual = {
          _id: 'ID',
          children: [
            {
              _id: 'child1',
              children: [{ _id: 'grandChild1' }, { _id: 'grandChild2' }],
              type: 'parallel',
            },
            { _id: 'child2' },
          ],
          initial: 'child2',
          promise: undefined,
        };
        const received = safeCompound(actual);
        expect(received).not.toThrowError();
        expect(received()).toEqual(actual);
      },
    );
  });
});

describe.concurrent('Atomic', () => {
  const safeAtomic = (value: any) => {
    return () => atomicNodeSchema.parse(value);
  };

  describe.concurrent('Not Atomic', () => {
    test.concurrent('No property is not defined', () => {
      const actual = {};
      expect(safeAtomic(actual)).toThrowError();
    });

    test.concurrent('Parallel node', () => {
      const actual = {
        _id: 'ID',
        type: 'parallel',
        children: [{ _id: 'child1' }, { _id: 'child2' }],
      };
      const received = safeAtomic(actual);
      expect(received).toThrowError();
    });

    test.concurrent('Compound node', () => {
      const actual = {
        _id: 'ID',
        initial: 'child1',
        children: [{ _id: 'child1' }, { _id: 'child2' }],
      };
      const received = safeAtomic(actual);
      expect(received).toThrowError();
    });

    test.concurrent('"promise" is defined', () => {
      const actual = {
        _id: 'ID',
        promise: '',
      };
      const received = safeAtomic(actual);
      expect(received).toThrowError();
    });
  });

  describe('Is Atomic', () => {
    test('"id" is the only defined property, "type" is defined to "atomic"', () => {
      const actual = {
        _id: 'ID',
        type: 'atomic',
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test('"id" is the only defined property, "description" is defined to undefined', () => {
      const actual = {
        _id: 'ID',
        description: undefined,
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test('"id" is defined, and "promise" is defined to undefined', () => {
      const actual = {
        _id: 'ID',
        promise: undefined,
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test('"id" and "description" are defined', () => {
      const actual = {
        _id: 'ID',
        description: 'A simple description',
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });

    test('"children" and "initial" are defined', () => {
      const actual = {
        _id: 'ID',
        description: 'A simple description',
        children: undefined,
        initial: undefined,
      };
      const received = safeAtomic(actual);
      expect(received).not.toThrowError();
      expect(received()).toEqual(actual);
    });
  });
});
