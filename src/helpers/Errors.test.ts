import { createError, createWarning } from './Errors';

describe.concurrent('createError', () => {
  test.concurrent('Function exists', () => {
    expect(createError).toBeDefined();
    expect(createError).toBeTypeOf('function');
  });

  test.concurrent('throws error if "emit"===true', () => {
    const code = 'one';
    const message = 'a error';
    const cause = 'cause';
    const actual = createError({ code, message, cause });

    expect(actual).toBeDefined();
    expect(actual).toBeInstanceOf(Error);
    expect(actual.message).toBe(message);
    expect(actual.name).toBe(code);
    expect(actual.cause).toBe(cause);
  });
});

describe.concurrent('createWarning', () => {
  test.concurrent('Function exists', () => {
    expect(createWarning).toBeDefined();
    expect(createWarning).toBeTypeOf('function');
  });

  test.concurrent('Console warn all if "cause" is defined', () => {
    const code = 'one';
    const message = 'a warning';
    const cause = 'cause';
    const spy = vi.spyOn(console, 'warn');
    createWarning({ code, message, cause });

    expect(spy).toBeCalledTimes(2);
    expect(spy).toBeCalledWith(code, '=>', message);
    expect(spy).toBeCalledWith('caused by', '=>', cause);
  });

  test.concurrent('Console warn all if "cause" is not defined', () => {
    const code = 'one';
    const message = 'a warning';
    const spy = vi.spyOn(console, 'warn');
    createWarning({ code, message });

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(code, '=>', message);
  });
});
