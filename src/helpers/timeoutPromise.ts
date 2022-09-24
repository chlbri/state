export function timeoutPromise<F extends (...args: any[]) => Promise<any>>(
  timeout: number,
  promise: F,
) {
  const _timeout = Promise.reject(
    new Error(`Promise timed out after ${timeout} ms`),
  );
  
  const out = (...args: Parameters<F>) => {
    return Promise.race([_timeout, promise(...args)]);
  };
  return out as F;
}
