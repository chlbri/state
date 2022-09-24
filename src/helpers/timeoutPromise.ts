/* eslint-disable @typescript-eslint/no-explicit-any */

export function timeoutPromise<T extends (...args: any[]) => Promise<any>>(
  timeout: number,
  promise: (...args: any[]) => Promise<any>,
) {
  const _timeout = Promise.reject(
    new Error(`Promise timed out after ${timeout} ms`),
  );
  const out = (...args: Parameters<T>) => {
    return Promise.race([_timeout, promise(...args)]);
  };
  return out as T;
}
