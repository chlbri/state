import { ERRORS } from '../constants';
import { getLastDefined } from './getLastDefined';

test.concurrent('Function exists', () => {
  expect(getLastDefined).toBeDefined();
  expect(getLastDefined).toBeTypeOf('function');
});

test.concurrent('the first one is defined, returns the first', () => {
  const actual = getLastDefined(1, undefined, 3, 4);
  expect(actual).toBe(1);
});

test.concurrent('the second one is defined, returns the second', () => {
  const actual = getLastDefined(undefined, 2, 3, 4);
  expect(actual).toBe(2);
});

test.concurrent('the fourth one is defined, returns the fourth', () => {
  const actual = getLastDefined(
    undefined,
    undefined,
    undefined,
    4,
    5,
    6,
    undefined,
    7,
  );
  expect(actual).toBe(4);
});

test.concurrent('the last one of 10 is defined, returns the last', () => {
  const actual = getLastDefined(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    10,
  );
  expect(actual).toBe(10);
});

test.concurrent('Throws an error if everything is not defined', () => {
  const actual = () =>
    getLastDefined(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  expect(actual).toThrowError(ERRORS.LAST_ELEMENT_OF_ARRAY);
});
